import React, { Component } from 'react';

export const ACTIVE_NOT_DELETED = 1;  // 没做完  2  auto3  4
export const DONE_NOT_DELETED = 2;  // 做完了  1  3(auto)?  5
export const EXPIRED_NOT_DELETED = 3;  // 没做完 & 过期了  2  4

export const ACTIVE_OR_EXPIRED_DELETED = 4;  // 没做完 & 被删除了  1  3(auto)?
export const DONE_DELETED = 5;  // 做完了 & 被删除了  2

export const P1 = 1;
export const P2 = 2;
export const P3 = 3;
export const P4 = 4;

export const dateDict = {
    '1':'01',
    '2':'02',

};

export function timeToDay(time) {
    return time.replace(/-/g,"/").split(" ")[0]
}

export function dateToPicker(time) {
    if (time === '2020/02/02') {
        let today = new Date();
        time = today.toLocaleDateString();
    }
    let temp = time.split('/');
    return temp[1] + '/' + temp[2] + '/' + temp[0]
}

export function inSenvenDays(date) {
    let today = new Date();
    today.setTime(today.getTime());
    for (let i=0; i<7; i++) {
        let res = today.getFullYear()+"/" + (today.getMonth() < 9 ? ('0' + (today.getMonth()+1)) : (today.getMonth() + 1)) + "/" + (today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate());
        if (res === date) {
            return true;
        }
        today.setDate(today.getDate() + 1);
    }
    return false;
}

