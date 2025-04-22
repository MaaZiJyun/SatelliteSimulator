from typing import Dict, List, Optional
from utils.calc_position import calc_position
from models import Body
from pydantic import BaseModel
import numpy as np

def build_positions_recursive(
    central_id: str,
    id_to_body: Dict[str, Body],
    id_to_position: Dict[str, List[float]]
):
    central_body = id_to_body[central_id]
    central_position = id_to_position[central_id]
    central_mass = central_body.mass

    # 找到所有 primary 是当前天体的对象
    for body_id, body in id_to_body.items():
        if body.primary == central_id:
            print(f"Processing body ID: {body_id} with primary: {central_id}")
            # 计算绝对坐标
            # abs_pos = calculate_absolute_position(body.initialState.position, central_position)
            satellite_mass = body.mass
            emi_major_axis = body.emiMajorAxis  # a, 半长轴，km
            eccentricity = body.eccentricity   # e，偏心率
            inclination = body.rotation.inclination,  
            abs_pos = calc_position(central_position=central_position,
                                    central_mass=central_mass,
                                    satellite_mass=satellite_mass,
                                    semi_major_axis=emi_major_axis,
                                    eccentricity=eccentricity,
                                    inclination=inclination,
                                    t=0)
            id_to_position[body.id] = abs_pos
            print(f"Body ID: {body.id}, Position: {abs_pos}")
            # print(f"Body ID: {body.id}, Position: {abs_pos}")
            # 递归处理其附属天体
            build_positions_recursive(body.id, id_to_body, id_to_position)
