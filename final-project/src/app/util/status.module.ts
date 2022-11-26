export enum Status {
  READYFORPICKUP = 0,
  RETRIEVED = 1,
}

export function getStatus(status: Status): string {
  switch (status) {
    case Status.READYFORPICKUP:
      return 'READY FOR PICKUP';
    case Status.RETRIEVED:
      return 'RETRIEVED';
  }
}
