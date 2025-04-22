from typing import List, Optional, Literal, Union
from pydantic import BaseModel


class Vector3D(BaseModel):
    x: float
    y: float
    z: float

    def to_list(self):
        return [self.x, self.y, self.z]


class InitialState(BaseModel):
    position: List[float]  # [x, y, z]
    velocity: List[float]  # [vx, vy, vz]


class Rotation(BaseModel):
    obliquity: float  # 地轴倾角
    initialMeridianAngle: float  # 初始子午线角
    rotationPeriod: float  # 自转周期（单位秒）


# class Visual(BaseModel):
#     color: Optional[str]
#     texture: Optional[str]
#     emissive: Optional[bool] = False
#     wireframe: Optional[bool] = False  # 添加这个字段



class GroundStation(BaseModel):
    name: str
    lat: float
    lon: float
    alt: float


class ObservationPoint(BaseModel):
    name: str
    lat: float
    lon: float
    alt: float


class Body(BaseModel):
    name: str
    type: Literal["star", "planet", "satellite", "natural-satellite", "artificial-satellite"]
    mass: float
    radius: float
    initialState: InitialState
    rotation: Rotation
    primary: Optional[str] = None  # 公转对象（如地球围绕 Sun）

    # 以下字段为选填，仅 planet 使用
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
