interface Text {
    text: string;
  }
  
  interface NamedText extends Text {
    name: Text;
  }
  
  interface Permission {
    text: string;
    permission: NamedText;
  }
  
  interface Configuration {
    id: string;
    text: string;
    name: Text;
    trash: Text;
  }
  
  interface Report {
    id: string;
    text: string;
    timestamp: Text;
    scan_start: Text;
    scan_end: Text;
    result_count: {
      text: string;
      hole: Text;
      info: Text;
      log: Text;
      warning: Text;
      false_positive: Text;
    };
    severity: Text;
  }

  interface Results {
    ids: string[];
  }
  
  interface Preference {
    text: string;
    name: Text;
    scanner_name: Text;
    value: Text;
  }
  
  interface Task {
    id: string;
    text: string;
    owner: NamedText;
    name: Text;
    comment: Text;
    creation_time: Text;
    modification_time: Text;
    writable: Text;
    in_use: Text;
    permissions: Permission;
    alterable: Text;
    usage_type: Text;
    config: Configuration;
    target: Configuration;
    hosts_ordering: Text;
    scanner: Configuration;
    status: Text;
    progress: Text;
    report_count: {
      text: string;
      finished: Text;
    };
    trend: Text;
    schedule: Configuration;
    schedule_periods: Text;
    last_report?: {
      text: string;
      report: Report;
    };
    results: Results
    observers: Text;
    preferences: {
      text: string;
      preference: Preference;
    };
  }
  
  export default Task