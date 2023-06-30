import TargetDataType from '../datatypes/TargetDataType'

  
export const emptyTarget: TargetDataType = {
    id: '',
    owner: {
      name: '',
    },
    name: '',
    comment: '',
    creation_time: '',
    modification_time: '',
    writable: '',
    in_use: '',
    permissions: {
      permission: {
        name: '',
      },
    },
    hosts: '',
    exclude_hosts: '',
    max_hosts: '',
    port_list: {
      id: '',
      name: '',
      trash: '',
    },
    ssh_credential: {
      id: '',
      name: '',
      port: '',
      trash: '',
    },
    smb_credential: {
      id: '',
      name: '',
      trash: '',
    },
    esxi_credential: {
      id: '',
      name: '',
      trash: '',
    },
    snmp_credential: {
      id: '',
      name: '',
      trash: '',
    },
    ssh_elevate_credential: {
      id: '',
      name: '',
      trash: '',
    },
    reverse_lookup_only: '',
    reverse_lookup_unify: '',
    alive_tests: '',
    allow_simultaneous_ips: '',
  };
  