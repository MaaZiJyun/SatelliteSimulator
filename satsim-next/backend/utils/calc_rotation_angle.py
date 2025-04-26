from datetime import datetime, timezone

def calc_rotation_angle(rotation, epoch: str, current_time: float) -> float:
    """
    计算自转角度（单位：度）
    rotation.period: 单位为秒
    rotation.initialMeridianAngle: 初始子午线角度（0-360）
    rotation.progradeDirection: 是否为顺行
    """
    # 平均角速度（度/秒）
    angular_speed = 360 / rotation.period  

    # 时间差（秒）
    epoch_dt = datetime.fromisoformat(epoch.replace("Z", "+00:00"))
    dt = current_time - epoch_dt.timestamp()

    # 当前角度（0~360°）
    angle = (rotation.initialMeridianAngle + angular_speed * dt) % 360

    # 如果是逆行方向
    if not rotation.progradeDirection:
        angle = (360 - angle) % 360

    return angle
