export const handleFormatTime = (value: string | Date) =>
  new Date(value).toLocaleDateString("vi-VI");
