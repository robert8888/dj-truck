import React from 'react';

export default function TBody({children, ...props}){
    return <tbody {...props}>{children}</tbody>
}