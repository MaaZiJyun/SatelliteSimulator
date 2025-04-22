import math
from typing import List
from models import AstroData, OrbitalElements, PositionResult

def compute_position(orbital_elements: OrbitalElements) -> List[float]:
    a = orbital_elements.semiMajorAxis
    e = orbital_elements.eccentricity
    i = math.radians(orbital_elements.inclination)
    raan = math.radians(orbital_elements.raan)
    omega = math.radians(orbital_elements.argOfPerigee)
    M = math.radians(orbital_elements.meanAnomaly)

    # 简单估算偏近点角 E = M
    E = M
    v = 2 * math.atan(math.sqrt((1 + e) / (1 - e)) * math.tan(E / 2))

    r = a * (1 - e ** 2) / (1 + e * math.cos(v))
    x_orb = r * math.cos(v)
    y_orb = r * math.sin(v)

    # 坐标旋转
    cos_Ω = math.cos(raan)
    sin_Ω = math.sin(raan)
    cos_i = math.cos(i)
    sin_i = math.sin(i)
    cos_ω = math.cos(omega)
    sin_ω = math.sin(omega)

    x = x_orb * (cos_Ω * cos_ω - sin_Ω * sin_ω * cos_i) - y_orb * (cos_Ω * sin_ω + sin_Ω * cos_ω * cos_i)
    y = x_orb * (sin_Ω * cos_ω + cos_Ω * sin_ω * cos_i) - y_orb * (sin_Ω * sin_ω - cos_Ω * cos_ω * cos_i)
    z = x_orb * sin_ω * sin_i + y_orb * cos_ω * sin_i

    return [x, y, z]

def compute_positions(data: AstroData, mode: str = "heliocentric") -> List[PositionResult]:
    results = []

    all_bodies = data.stars + data.planets + data.naturalSatellites + data.artificialSatellites

    for body in all_bodies:
        if body.orbitalElements:
            coords = compute_position(body.orbitalElements)
            results.append(PositionResult(
                name=body.name,
                x=coords[0],
                y=coords[1],
                z=coords[2],
                vx=0.0,  # 占位速度
                vy=0.0,
                vz=0.0
            ))

    return results
