import request from '@/util/request';

export function login(parms) {
    return request({
        method: 'POST',
        url: '/user/login',
        data:parms
        
    });
}
