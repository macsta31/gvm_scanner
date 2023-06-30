interface Text {
    text: string;
  }
  
  interface NamedText extends Text {
    name: Text;
  }
  
  interface Count {
    text: string;
    count: Text;
  }
  
  interface Asset {
    asset_id: string;
    text: string;
  }
  
  interface Nvt {
    oid: string;
    text: string;
    type: Text;
    name: Text;
    cvss_base: Text;
  }
  
  interface Error {
    text: string;
    host: {
      text: string;
      asset: Asset;
    };
    port: Text;
    description: Text;
    nvt: Nvt;
    scan_nvt_version: Text;
    severity: Text;
  }
  interface Configuration {
    id: string;
    text: string;
    trash: Text;
    name: Text;
    comment: Text;
  }
  
  
  interface Task extends NamedText {
    id: string;
    comment: Text;
    target: Configuration;
    progress: Text;
  }
  
  interface Filter {
    text: string;
    column: Text;
    relation: Text;
    value: Text;
  }

  interface Result {
    id: string;
    text: string;
    name: {
      text: string;
    };
    owner: {
      text: string;
      name: {
        text: string;
      }
    };
    modification_time: {
      text: string;
    };
    comment: {
      text: string;
    };
    creation_time: {
      text: string;
    };
    host: {
      text: string;
      asset: {
        asset_id: string;
        text: string;
      };
      hostname: {
        text: string;
      }
    };
    port: {
      text: string;
    };
    nvt: {
      oid: string;
      text: string;
      type: {
        text: string;
      };
      name: {
        text: string;
      };
      family: {
        text: string;
      };
      cvss_base: {
        text: string;
      };
      severities: {
        score: string;
        text: string;
        severity: {
          type: string;
          text: string;
          origin: {
            text: string;
          };
          date: {
            text: string;
          };
          score: {
            text: string;
          };
          value: {
            text: string;
          };
        };
      };
      tags: {
        text: string;
      };
      solution: {
        type: string;
        text: string;
      };
      refs: {
        text: string;
        ref: {
          id: string;
          type: string;
          text: string;
        }
      };
    };
    scan_nvt_version: {
      text: string;
    };
    threat: {
      text: string;
    };
    severity: {
      text: string;
    };
    qod: {
      text: string;
      value: {
        text: string;
      };
      type: {
        text: string;
      }
    };
    description: {
      text: string;
    };
    original_threat: {
      text: string;
    };
    original_severity: {
      text: string;
    };
  }

  interface Host {
    text: string;
    ip: {
      text: string;
    };
    asset: {
      asset_id: string;
      text: string;
    };
    start: {
      text: string;
    };
    end: {
      text: string;
    };
    port_count: {
      text: string;
      page: {
        text: string;
      };
    };
    result_count: {
      text: string;
      page: {
        text: string;
      };
      hole: {
        text: string;
        page: {
          text: string;
        };
      };
      warning: {
        text: string;
        page: {
          text: string;
        };
      };
      info: {
        text: string;
        page: {
          text: string;
        };
      };
      log: {
        text: string;
        page: {
          text: string;
        };
      };
      false_positive: {
        text: string;
        page: {
          text: string;
        };
      };
    };
    detail: {
      text: string;
      name: {
        text: string;
      };
      value: {
        text: string;
      };
      source: {
        text: string;
        type: {
          text: string;
        };
        name: {
          text: string;
        };
        description: {
          text: string;
        };
      };
      extra: {
        text: string;
      };
    };
  }

  interface Ports {
    max: string;
    start: string;
    text: string;
    count: {
      text: string;
    };
    port: {
      text: string;
      host: {
        text: string;
      };
      severity: {
        text: string;
      };
      threat: {
        text: string;
      };
    };
  }
  
  
  
  
  interface ReportDetail {
    id: string;
    text: string;
    gmp: {
      text: string;
      version: Text;
    };
    sort: {
      text: string;
      field: {
        text: string;
        order: Text;
      };
    };
    filters: {
      id: string;
      text: string;
      term: Text;
      filter: Text;
      keywords: {
        text: string;
        keyword: Filter;
      };
    };
    scan_run_status: Text;
    hosts: Count;
    host: Host;
    closed_cves: Count;
    vulns: Count;
    os: Count;
    ports: Ports
    apps: Count;
    ssl_certs: Count;
    task: Task;
    timestamp: Text;
    scan_start: Text;
    timezone: Text;
    timezone_abbrev: Text;
    result_count: {
      text: string;
      full: Text;
      filtered: Text;
      hole: Count;
      info: Count;
      log: Count;
      warning: Count;
      false_positive: Count;
    };
    results:{
      max: string;
      result: Result;
      start: string;
      text: string;
    };
    severity: {
      text: string;
      full: Text;
      filtered: Text;
    };
    scan_end: Text;
    errors: {
      text: string;
      count: Text;
      error: Error;
    };
  }
  
  interface Report {
    content_type: string;
    extension: string;
    format_id: string;
    id: string;
    text: string;
    owner: NamedText;
    name: Text;
    comment: Text;
    creation_time: Text;
    modification_time: Text;
    writable: Text;
    in_use: Text;
    task: NamedText;
    report: ReportDetail;
  }
  
export default Report
  