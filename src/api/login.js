import request from '@/util/request';

export function login(parms) {
    return request({
        method: 'GET',
        url: '/admin/AA',
        parms
    });
}