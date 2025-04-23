from typing import List, Optional, Literal, Union
from pydantic import BaseModel


# class Vector3D(BaseModel):
#     x: float
#     y: float
#     z: float

#     def to_list(self):
#         return [self.x, self.y, self.z]
    
class Physical(BaseModel):
    mass: float  # 质量（单位：kg）
    radius: float  # 半径（单位：m）

class State(BaseModel):
    position: List[float]  # [x, y, z]
    velocity: List[float]  # [vx, vy, vz]

class Rotation(BaseModel):
    period: float  # 自转周期（单位秒）
    obliquity: float  # 地轴倾角
    initialMeridianAngle: float  # 初始子午线角
    progradeDirection: bool  # 是否顺时针自转
    
class Orbit(BaseModel):
    semiMajorAxis: float  # 半长轴（单位：km）
    eccentricity: float  # 偏心率
    inclination: float  # 倾角（单位：°）
    longitudeOfAscendingNode: float  # 升交点经度（单位：°）
    argumentOfPeriapsis: float  # 近地点幅角（单位：°）
    meanAnomalyAtEpoch: float  # 平近点角（单位：°）
    epoch: str


class GroundStation(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    alt: float


class ObservationPoint(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    alt: float


class Body(BaseModel):
    id: str
    name: str
    type: Literal["star", "planet", "natural-satellite", "artificial-satellite"]
    physical: Physical
    state: State
    rotation: Rotation

    # 以下字段为选填，仅 planet 使用
    orbit: Optional[Orbit] = None
    primary: Optional[str] = None  # 公转对象（如地球围绕 Sun）
    groundStations: Optional[List[GroundStation]] = []
    observationPoints: Optional[List[ObservationPoint]] = []
    
    class Config:
        extra = "ignore"  # 忽略额外字段


class SolarSystemData(BaseModel):
    stars: List[Body] = []
    planets: List[Body] = []
    naturalSatellites: List[Body] = []
    artificialSatellites: List[Body] = []


class SolarSystemRequest(BaseModel):
    data: SolarSystemData
    mode: Literal["heliocentric", "geocentric"]  # 模式可以限制视图中心（如太阳系或地心）
    timeSlotNum: int # 时间槽数量
    timeSlotDuration: int # 当前时间，单位秒
