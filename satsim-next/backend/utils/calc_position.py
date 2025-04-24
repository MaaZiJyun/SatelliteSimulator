import numpy as np
from typing import List

G = 6.67430e-20  # km^3/kg/s^2

def solve_kepler_equation(M, e, tolerance=1e-6):
    """迭代求解开普勒方程 M = E - e*sin(E)，返回偏近点角 E"""
    
    # 参数检查
    if not np.isfinite(M):
        raise ValueError(f"Mean anomaly M is not a finite number: M = {M}")
    if not (0 <= e < 1):
        raise ValueError(f"Eccentricity must be in [0, 1): e = {e}")
    
    E = M if e < 0.8 else np.pi  # 初始猜测

    iteration = 0
    while True:
        delta = (E - e * np.sin(E) - M) / (1 - e * np.cos(E))
        E -= delta
        iteration += 1

        # 打印调试信息（可选）
        # print(f"[{iteration}] E = {E}, delta = {delta}")
        
        if abs(delta) < tolerance:
            break

        if not np.isfinite(E):
            raise RuntimeError("E became non-finite (nan or inf) during iteration.")

    return E

def calc_position(
    central_position: List[float],
    central_mass: float,
    satellite_mass: float,
    semi_major_axis: float,  # a, 半长轴，km
    eccentricity: float,     # e，偏心率
    inclination: float,      # i，倾角，单位为°（将转为弧度）
    t: float                 # 当前时间，单位为秒
) -> List[float]:
    """
    在更真实的椭圆轨道中计算某时刻在 HCI 坐标系下的位置
    """

    mu = G * (central_mass + satellite_mass)  # 万有引力参数
    a = semi_major_axis
    e = eccentricity
    i_rad = np.radians(inclination)

    # 1. 计算轨道周期
    T = 2 * np.pi * np.sqrt(a**3 / mu)

    # 2. 平近点角 M
    M = 2 * np.pi * (t % T) / T  # rad

    # 3. 偏近点角 E（通过数值方法求解）
    E = solve_kepler_equation(M, e)

    # 4. 真近点角 θ（true anomaly）
    theta = 2 * np.arctan2(
        np.sqrt(1 + e) * np.sin(E / 2),
        np.sqrt(1 - e) * np.cos(E / 2)
    )

    # 5. 当前轨道半径 r
    r = a * (1 - e * np.cos(E))

    # 6. 在轨道平面中的位置（x', y'）
    x_prime = r * np.cos(theta)
    y_prime = r * np.sin(theta)
    z_prime = 0

    # 7. 旋转：绕 x 轴倾斜轨道平面
    #    这里只做 inclination 倾角旋转（简化，未加Ω和ω）
    x = x_prime
    y = y_prime * np.cos(i_rad)
    z = y_prime * np.sin(i_rad)

    # 8. 加上中心天体位置
    return [
        float(central_position[0] + x),
        float(central_position[1] + y),
        float(central_position[2] + z),
    ]

