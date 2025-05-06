from typing import Dict, List

from models import Body, SolarSystemRequest
from utils.build_positions_recursive import build_positions_recursive


def process_heliocentric_system(request: SolarSystemRequest) -> Dict[str, List[float]]:
    data = request.data
    time_slot = request.timeSlotNum
    time_slot_duration = request.timeSlotDuration

    all_bodies: List[Body] = (
        data.stars + 
        data.planets + 
        data.naturalSatellites + 
        data.artificialSatellites
    )
    
    # frames: List[Dict[str, List[float]]] = []
    frames: List[Dict[str, Dict[str, List[float]]]] = []

    id_to_body: Dict[str, Body] = {body.id: body for body in all_bodies}
    
    root = next((b for b in all_bodies if b.primary is None), None)
    if not root:
        raise ValueError("No root body found (must have a body with no primary).")
    
    
    for slot in range(time_slot):
        # 开始递归计算所有附属天体位置
        t = slot * time_slot_duration
        
        id_to_position: Dict[str, List[float]] = {}
        id_to_velocity: Dict[str, List[float]] = {}
        id_to_rotation: Dict[str, float] = {}
        
        id_to_position[root.id] = root.state.position
        id_to_velocity[root.id] = root.state.velocity
        id_to_rotation[root.id] = root.rotation
        
        build_positions_recursive(root.id, id_to_body, id_to_position, id_to_velocity, id_to_rotation, t)
        
        # frames.append(id_to_position.copy())
        # print(f"Frame {t}: {id_to_position}")
        frame: Dict[str, Dict[str, float]] = {}
        for body_id in id_to_position:
            frame[body_id] = {
                "position": id_to_position[body_id],
                "velocity": id_to_velocity[body_id],
                "rotation": id_to_rotation[body_id]
            }

        frames.append(frame)
        # print(f"Frame {t}: {frame}")

    # return id_to_position
    return frames
