import React, { useContext } from 'react';
import { ThreadCommonContext } from '../utils';

const Index = () => {
    const { dispatch } = useContext(ThreadCommonContext)

    const onClick = () => {
        dispatch('test', 1)
    }

    return (
        <div onClick={onClick}>点赞、打赏</div>
    )
}

export default React.memo(Index) 