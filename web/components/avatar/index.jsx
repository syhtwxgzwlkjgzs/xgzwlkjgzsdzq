import React, {useMemo} from 'react';
import styles from './index.module.scss';
import { Avatar } from '@discuzq/design';

export default function avatar(props) {
    const {image = '', name = '匿', onClick = () => {}, className = '', circle = true} = props;

    const userName = useMemo(() => {
        const newName = name.toLocaleUpperCase()[0];
        return newName;
    }, [name]);

    if ( image && image !== '' ) {
        return (<Avatar className={className} circle={circle} image={image} onClick={onClick}></Avatar>);
    }

    return (
        <div className={styles.noImageAvatar} onClick={onClick}>
            <p>{userName}</p>
        </div>
    );

}