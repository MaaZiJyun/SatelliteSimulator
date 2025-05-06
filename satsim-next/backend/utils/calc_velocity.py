from typing import List

import numpy as np

from utils.new_calc_position import new_calc_position


def calc_velocity(
    central_position: List[float],
    central_mass: float,
    satellite_mass: float,
    semi_major_axis: float,
    eccentricity: float,
    inclination: float,
    longitude_of_ascending_node: float,
    argument_of_periapsis: float,
    mean_anomaly_at_epoch: float,
    epoch: str,
    current_time: float,
    delta_t: float = 1.0  # 秒
) -> List[float]:
    """
    使用数值微分近似计算速度向量（单位：km/s）
    """
    pos_prev = np.array(new_calc_position(
        central_position, central_mass, satellite_mass,
        semi_major_axis, eccentricity, inclination,
        longitude_of_ascending_node, argument_of_periapsis,
        mean_anomaly_at_epoch, epoch, current_time - delta_t
    ))

    pos_next = np.array(new_calc_position(
        central_position, central_mass, satellite_mass,
        semi_major_axis, eccentricity, inclination,
        longitude_of_ascending_node, argument_of_periapsis,
        mean_anomaly_at_epoch, epoch, current_time + delta_t
    ))

    velocity = (pos_next - pos_prev) / (2 * delta_t)
    return velocity.tolist()
