export const ACTIVE_NOT_DELETED = 1;
export const DONE_NOT_DELETED = 2;
export const EXPIRED_NOT_DELETED = 3;
export const ACTIVE_OR_EXPIRED_DELETED = 4;
export const DONE_DELETED = 5;

export const P1 = 1;
export const P2 = 2;
export const P3 = 3;
export const P4 = 4;

export function timeToDay(time) {
    return time.replace(/-/g,"/").split(" ")[0]
}

// ActiveNotDeleted  // undone
// DoneNotDeleted  // done
// ExpiredNotDeleted  // 过期
// ActiveOrExpiredDeleted  // undone/过期 删除
// DoneDeleted  // done 删除

// P1  // 未分配
// P2  // 低
// P3  // 中
// P4  // 高
