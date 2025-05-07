export function getWeekDays(): string {
  const today = new Date();

  const daysInPortuguese = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];

  const relativeDays = ['hoje', 'amanhã', 'depois de amanhã'];

  let result = '';

  // Format next 7 days
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const dayName = daysInPortuguese[currentDate.getDay()];
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      '0',
    )}/${String(currentDate.getMonth() + 1).padStart(
      2,
      '0',
    )}/${currentDate.getFullYear()}`;

    // Add relative day name for first three days
    const prefix = i < 3 ? `${relativeDays[i]} - ` : '';

    result += `${prefix}${dayName}: ${formattedDate}\n`;
  }

  return result.trim();
}
