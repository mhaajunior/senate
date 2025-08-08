export const internStatusOptions = [
  {
    id: 1,
    name: "ขอฝึกงาน",
  },
  {
    id: 2,
    name: "หลังจากตอบรับ",
  },
];

export const STATUS_CATEGORY = {
  PENDING: [1, 2, 3],
  VERIFY: [4, 6, 7, 8, 9, 10, 11, 12, 13],
  COMPLETE: [14, 15, 16, 17, 18],
  CANCEL: [5, 19],
  OTHER: [20],
};

export interface SelectOption {
  id: number;
  name: string;
}

export interface StatusSelectOption extends SelectOption {
  type: number;
  parentId?: number;
}

export interface GroupSelectOption extends SelectOption {
  officeId: number;
}
