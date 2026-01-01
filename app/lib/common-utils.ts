export const capitalize = (input: string) => {
  return input.substring(0, 1).toUpperCase() + input.substring(1);
}

export const convertEpochToDateTime = (epoch: number) => {
  const dateTime = new Date(epoch);
  const formattedDate = dateTime.toLocaleDateString('en-US', { dateStyle: 'medium' });
  const formattedTime = dateTime.toLocaleTimeString('en-US', { timeStyle: 'short' });
  return `${formattedDate} ${formattedTime}`;
}