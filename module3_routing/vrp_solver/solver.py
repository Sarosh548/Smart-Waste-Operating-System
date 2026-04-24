from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import math

def haversine_distance(lat1, lng1, lat2, lng2):
    """Distance in meters between two GPS points."""
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def build_distance_matrix(locations):
    """locations = list of {lat, lng} dicts"""
    n = len(locations)
    matrix = []
    for i in range(n):
        row = []
        for j in range(n):
            if i == j:
                row.append(0)
            else:
                d = haversine_distance(
                    locations[i]['lat'], locations[i]['lng'],
                    locations[j]['lat'], locations[j]['lng']
                )
                row.append(int(d))
        matrix.append(row)
    return matrix

def solve_vrp(bins, num_trucks=2, depot_lat=31.5204, depot_lng=74.3587):
    """
    bins: list of {id, lat, lng, fill_level, waste_type}
    Returns optimized routes for each truck.
    """
    # Filter only bins that need collection (fill > 0.6)
    priority_bins = [b for b in bins if b.get('fill_level', 0) >= 0.6]
    
    if not priority_bins:
        return {"message": "No bins need collection", "routes": []}

    # Build locations — depot first
    depot = {"lat": depot_lat, "lng": depot_lng, "id": "DEPOT"}
    locations = [depot] + priority_bins
    n = len(locations)

    # Distance matrix
    distance_matrix = build_distance_matrix(locations)

    # OR-Tools setup
    manager = pywrapcp.RoutingIndexManager(n, num_trucks, 0)
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node   = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Distance dimension
    routing.AddDimension(
        transit_callback_index,
        0,        # no slack
        50000,    # max 50km per truck
        True,
        'Distance'
    )
    distance_dimension = routing.GetDimensionOrDie('Distance')
    distance_dimension.SetGlobalSpanCostCoefficient(100)

    # Priority — higher fill = visit first
    for i, bin_data in enumerate(priority_bins, start=1):
        fill = bin_data.get('fill_level', 0)
        if fill >= 0.85:
            routing.AddDisjunction([manager.NodeToIndex(i)], 0)

    # Search parameters
    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_params.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_params.time_limit.seconds = 5

    # Solve
    solution = routing.SolveWithParameters(search_params)

    if not solution:
        return {"message": "No solution found", "routes": []}

    # Extract routes
    routes = []
    total_distance = 0

    for truck_id in range(num_trucks):
        route_stops = []
        route_distance = 0
        index = routing.Start(truck_id)

        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            if node == 0:
                route_stops.append({
                    "stop_number": len(route_stops) + 1,
                    "type"       : "depot",
                    "id"         : "DEPOT",
                    "lat"        : depot_lat,
                    "lng"        : depot_lng,
                    "fill_level" : None,
                })
            else:
                bin_data = priority_bins[node - 1]
                route_stops.append({
                    "stop_number": len(route_stops) + 1,
                    "type"       : "bin",
                    "id"         : bin_data.get('id'),
                    "lat"        : bin_data['lat'],
                    "lng"        : bin_data['lng'],
                    "fill_level" : bin_data.get('fill_level'),
                    "waste_type" : bin_data.get('waste_type'),
                    "zone"       : bin_data.get('zone', 'Unknown'),
                })

            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, truck_id
            )

        # Add return to depot
        route_stops.append({
            "stop_number": len(route_stops) + 1,
            "type"       : "depot",
            "id"         : "DEPOT",
            "lat"        : depot_lat,
            "lng"        : depot_lng,
            "fill_level" : None,
        })

        total_distance += route_distance
        routes.append({
            "truck_id"      : f"TRUCK-{truck_id + 1:02d}",
            "stops"         : route_stops,
            "total_bins"    : len([s for s in route_stops if s['type'] == 'bin']),
            "distance_meters": route_distance,
            "distance_km"   : round(route_distance / 1000, 2),
            "estimated_mins": round(route_distance / 1000 / 30 * 60),
        })

    return {
        "total_trucks"         : num_trucks,
        "total_bins_to_collect": len(priority_bins),
        "total_distance_km"    : round(total_distance / 1000, 2),
        "routes"               : routes,
    }