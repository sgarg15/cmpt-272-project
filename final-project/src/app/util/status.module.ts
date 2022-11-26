export enum Status {
  READYFORPICKUP = 1,
  RETRIEVED = 2,
}

export function getStatus(status: Status): string {
  switch (status) {
    case Status.READYFORPICKUP:
      return 'READY FOR PICKUP';
    case Status.RETRIEVED:
      return 'RETRIEVED';
  }
}
