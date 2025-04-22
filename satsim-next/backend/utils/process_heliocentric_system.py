from typing import Dict, List

from models import Body, SolarSystemRequest
from utils.build_positions_recursive import build_positions_recursive


def process_heliocentric_system(request: SolarSystemRequest) -> Dict[str, List[float]]:
    system_data = request.data

    all_bodies: List[Body] = (
        system_data.stars + 
        system_data.planets + 
        system_data.naturalSatellites + 
        system_data.artificialSatellites
    )

    # 建立映射
    id_to_body: Dict[str, Body] = {body.id: body for body in all_bodies}
    # print(f"ID to Body Mapping: {id_to_body}")
    id_to_position: Dict[str, List[float]] = {}

    # 找到 root（没有 primary 的天体）
    root = next((b for b in all_bodies if b.primary is None), None)
    if not root:
        raise ValueError("No root body found (must have a body with no primary).")

    # root 本身位置就是绝对位置
    id_to_position[root.id] = root.initialState.position

    # 开始递归计算所有附属天体位置
    build_positions_recursive(root.id, id_to_body, id_to_position)
    # print(f"Root Body ID: {root.id}, Position: {id_to_position[root.id]}")

    return id_to_position
