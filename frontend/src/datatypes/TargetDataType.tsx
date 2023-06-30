export default interface Target {
  id: string;
  owner: {
    name: string;
  };
  name: string;
  comment: string;
  creation_time: string;
  modification_time: string;
  writable: string;
  in_use: string;
  permissions: {
    permission: {
      name: string;
    };
  };
  hosts: string;
  exclude_hosts: string;
  max_hosts: string;
  port_list: {
    id: string;
    name: string;
    trash: string;
  };
  ssh_credential: {
    id: string;
    name: string;
    port: string;
    trash: string;
  };
  smb_credential: {
    id: string;
    name: string;
    trash: string;
  };
  esxi_credential: {
    id: string;
    name: string;
    trash: string;
  };
  snmp_credential: {
    id: string;
    name: string;
    trash: string;
  };
  ssh_elevate_credential: {
    id: string;
    name: string;
    trash: string;
  };
  reverse_lookup_only: string;
  reverse_lookup_unify: string;
  alive_tests: string;
  allow_simultaneous_ips: string;
  [key: string]: any;
}

interface GetTargetsResponse {
  get_targets_response: {
    status: string;
    status_text: string;
    target: Target | Target[];
  };
}
