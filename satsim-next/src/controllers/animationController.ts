export async function computeController({
    structuredData,
    time_slot,
    slot_duration,
    mode = "heliocentric"
}: { 
    structuredData: any, 
    time_slot: number, 
    slot_duration: number, 
    mode?: string 
}): Promise<any[]> {
    try {
        const res = await fetch("/api/compute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: structuredData,
                mode,
                timeSlotNum: time_slot,
                timeSlotDuration: slot_duration,
            }),
        });

        const result = await res.json();

        if (res.ok && result?.result) {
            return result.result;
        } else {
            console.error("请求成功但结果为空：", result);
            return [];
        }
    } catch (err) {
        console.error("请求失败：", err);
        return [];
    }
}
