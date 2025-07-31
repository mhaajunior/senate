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
