import numpy as np
from typing import List
from datetime import datetime

G = 6.67430e-20  # km^3/kg/s^2

def solve_kepler_equation(M, e, tolerance=1e-6):
    E = M if e < 0.8 else np.pi
    while True:
        delta = (E - e * np.sin(E) - M) / (1 - e * np.cos(E))
        E -= delta
        if abs(delta) < tolerance:
            break
    return E

def new_calc_position(
    central_position: List[float],
    central_mass: float,
    satellite_mass: float,
    semi_major_axis: float,
    eccentricity: float,
    inclination: float,
    longitude_of_ascending_node: float,
    argument_of_periapsis: float,
    mean_anomaly_at_epoch: float,
    epoch: str,     # ISO 时间字符串，例如 "2025-01-01T00:00:00Z"
    current_time: float  # 当前时间戳（秒）
) -> List[float]:
    """
    根据 6 个轨道要素计算卫星在三维空间中的位置
    """

    # 单位转换
    i = np.radians(inclination)
    Ω = np.radians(longitude_of_ascending_node)
    ω = np.radians(argument_of_periapsis)
    M0 = np.radians(mean_anomaly_at_epoch)

    # 引力参数 μ
    mu = G * (central_mass + satellite_mass)
    a = semi_major_axis

    # 轨道周期
    T = 2 * np.pi * np.sqrt(a**3 / mu)

    # 时间差 Δt
    epoch_dt = datetime.fromisoformat(epoch.replace("Z", "+00:00"))
    dt = current_time - epoch_dt.timestamp()

    # 当前平近点角 M
    n = 2 * np.pi / T  # 平均角速度
    M = (M0 + n * dt) % (2 * np.pi)

    # 偏近点角 E
    E = solve_kepler_equation(M, eccentricity)

    # 真近点角 θ
    theta = 2 * np.arctan2(
        np.sqrt(1 + eccentricity) * np.sin(E / 2),
        np.sqrt(1 - eccentricity) * np.cos(E / 2)
    )

    # 当前半径 r
    r = a * (1 - eccentricity * np.cos(E))

    # 轨道平面坐标 (x', y', z'=0)
    x_prime = r * np.cos(theta)
    y_prime = r * np.sin(theta)
    z_prime = 0

    # 三维旋转变换：先绕 z 轴转 Ω，再绕 x 轴转 i，最后绕 z 轴转 ω
    # 总变换矩阵 R = Rz(Ω) * Rx(i) * Rz(ω)
    cosΩ, sinΩ = np.cos(Ω), np.sin(Ω)
    cosω, sinω = np.cos(ω), np.sin(ω)
    cosi, sini = np.cos(i), np.sin(i)

    # 组合旋转矩阵
    R11 = cosΩ * cosω - sinΩ * sinω * cosi
    R12 = -cosΩ * sinω - sinΩ * cosω * cosi
    R13 = sinΩ * sini
    R21 = sinΩ * cosω + cosΩ * sinω * cosi
    R22 = -sinΩ * sinω + cosΩ * cosω * cosi
    R23 = -cosΩ * sini
    R31 = sinω * sini
    R32 = cosω * sini
    R33 = cosi

    # 三维坐标变换
    x = R11 * x_prime + R12 * y_prime + R13 * z_prime
    y = R21 * x_prime + R22 * y_prime + R23 * z_prime
    z = R31 * x_prime + R32 * y_prime + R33 * z_prime

    # 返回世界坐标
    return [
        float(central_position[0] + x),
        float(central_position[1] + y),
        float(central_position[2] + z),
    ]
