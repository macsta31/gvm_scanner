import React from 'react'

interface TargetProps{
    id: string;
    owner: string,
    name: string,
    creation_time: string,
    in_use: string,
    hosts: string,
    port_list: string,
}

const Target:React.FC<TargetProps> = ({ id, owner, name, creation_time, in_use, hosts, port_list }) => {
  return (
    <div>
        {id}

    </div>
  )
}

export default Target