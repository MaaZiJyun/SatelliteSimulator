from typing import Dict, List, Optional
from utils.new_calc_position import new_calc_position
from utils.calc_position import calc_position
from models import Body
from pydantic import BaseModel
import numpy as np

def build_positions_recursive(
    central_id: str,
    id_to_body: Dict[str, Body],
    id_to_position: Dict[str, List[float]],
    t:float = 0
):
    central_body = id_to_body[central_id]
    centralPosition = id_to_position[central_id]
    centralMass = central_body.physical.mass

    # 找到所有 primary 是当前天体的对象
    for body_id, body in id_to_body.items():
        if body.primary == central_id:
            print(f"Processing body ID: {body_id} with primary: {central_id}")
            # 计算绝对坐标
            # abs_pos = calculate_absolute_position(body.initialState.position, central_position)
            satelliteMass = body.physical.mass
            semiMajorAxis = body.orbit.semiMajorAxis  # a, 半长轴，km
            eccentricity = body.orbit.eccentricity   # e，偏心率
            inclination = body.orbit.inclination,  
            # abs_pos = calc_position(central_position=centralPosition,
            #                         central_mass=centralMass,
            #                         satellite_mass=satelliteMass,
            #                         semi_major_axis=semiMajorAxis,
            #                         eccentricity=eccentricity,
            #                         inclination=inclination,
            #                         t=t)
            abs_pos = new_calc_position(
                central_position=centralPosition,
                central_mass=centralMass,
                satellite_mass=satelliteMass,
                semi_major_axis=semiMajorAxis,
                eccentricity=eccentricity,
                inclination=inclination[0],
                longitude_of_ascending_node=body.orbit.longitudeOfAscendingNode,
                argument_of_periapsis=body.orbit.argumentOfPeriapsis,
                mean_anomaly_at_epoch=body.orbit.meanAnomalyAtEpoch,
                epoch=body.orbit.epoch,
                current_time=t
            )
            id_to_position[body.id] = abs_pos
            print(f"Body ID: {body.id}, Position: {abs_pos}")
            # print(f"Body ID: {body.id}, Position: {abs_pos}")
            # 递归处理其附属天体
            build_positions_recursive(body.id, id_to_body, id_to_position,t)
