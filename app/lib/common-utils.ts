export const capitalize = (input: string) => {
  return input.substring(0, 1).toUpperCase() + input.substring(1);
}

export const convertEpochToDateTime = (epoch: number) => {
  const dateTime = new Date(epoch * 1000);
  const formattedDate = dateTime.toLocaleDateString(undefined, {dateStyle: 'medium'});
  const formattedTime = dateTime.toLocaleTimeString(undefined, { timeStyle: 'short' });
  return `${formattedDate} ${formattedTime}`;
}