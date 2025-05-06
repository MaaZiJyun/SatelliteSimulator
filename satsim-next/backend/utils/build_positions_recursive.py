from typing import Dict, List, Optional
from utils.calc_velocity import calc_velocity
from utils.calc_rotation_angle import calc_rotation_angle
from utils.new_calc_position import new_calc_position
from models import Body
import numpy as np

def build_positions_recursive(
    central_id: str,
    id_to_body: Dict[str, Body],
    id_to_position: Dict[str, List[float]],
    id_to_velocity: Dict[str, List[float]], 
    id_to_rotation: Dict[str, float],
    t:int = 0
):
    central_body = id_to_body[central_id]
    centralPosition = id_to_position[central_id]
    centralMass = central_body.physical.mass
    
    if central_body.orbit is not None:
        abs_rot = calc_rotation_angle(rotation=central_body.rotation, epoch=central_body.orbit.epoch, current_time=t)
    else:
        abs_rot = 0.0
        
    # print(f"id_to_rotation before update: {id_to_rotation}")
    id_to_rotation[central_id] = abs_rot

    # 找到所有 primary 是当前天体的对象
    for body_id, body in id_to_body.items():
        if body.primary == central_id:
            # print(f"Processing body ID: {body_id} with primary: {central_id}")
            # 计算绝对坐标
            # abs_pos = calculate_absolute_position(body.initialState.position, central_position)
            satelliteMass = body.physical.mass
            semiMajorAxis = body.orbit.semiMajorAxis  # a, 半长轴，km
            eccentricity = body.orbit.eccentricity   # e，偏心率
            inclination = body.orbit.inclination,  
            
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
            
            abs_vel = calc_velocity(
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
                current_time=t,
                delta_t=1.0
            )
            
            id_to_position[body.id] = abs_pos
            id_to_velocity[body.id] = abs_vel
            
            # print(f"Body ID: {body.id}, Position: {abs_pos}")
            
            # build_positions_recursive(body.id, id_to_body, id_to_position,t)
            build_positions_recursive(body.id, id_to_body, id_to_position, id_to_velocity, id_to_rotation, t)
