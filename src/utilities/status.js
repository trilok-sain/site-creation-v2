import { roleIds, statuColor, status } from "./constants"


export const getDisplayStatus = row => {
    const roleId = sessionStorage.getItem("roleId");
    if (!!roleId) {
        return (
            row.status === status.PENDING
                ? status.PENDING
                : [roleIds.ADMIN, roleIds.RM, roleIds.LEGAL].includes(roleId)
                    ? row.status
                    // [roleIds.BROKER, roleIds.LANDLORD].includes(roleId)
                    : row.status === status.PENDING_FROM_ADMIN
                        ? status.SHORTLISTED
                        : row.status === status.PENDING_FROM_LEGAL
                            ? status.APPROVED
                            : row.status === status.APPROVED
                                ? status.PASSED
                                : row.status
        )

    }
    return row?.status
}

export const getStatusColor = row => {
    return row?.status === status?.APPROVED
        ? statuColor.GREEN
        : row?.status === status?.REJECTED
            ? statuColor.RED
            : status?.PENDING_FROM_ADMIN === row?.status 
                ? statuColor.ORANGE
                :[status?.PENDING, status.PENDING_FROM_LEGAL].includes(row?.status)  
                ? statuColor.BLUE
                : "";
}