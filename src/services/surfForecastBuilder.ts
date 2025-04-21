import { openAiAPI, GPTModel } from '../interfaces/openAiAPI';

// Define o contexto para o prompt
const context = `
Você está analisando um conjunto de dados de condições de surfe para diferentes horários do dia.
Cada parte do dado está separada por um identificador de tempo (por exemplo, "3h", "6h", etc.)
inclui dados sobre ondas, swell, vento, clima e energia das ondas. Aqui está a estrutura dos dados:

1. **Condições do Surfe**: altura da onda (m), altura total da onda (m), período da onda (s), direção do swell (°).
2. **Condições do Swell**: altura do swell (m), período do swell (s), direção do swell (°).
3. **Condições do Vento**: velocidade do vento (km/h), rajadas do vento (km/h), direção do vento (°), velocidade do vento marítimo (km/h), direção do vento marítimo (°).
4. **Condições Climáticas**: temperatura do ar (°C), cobertura de nuvens (%), CAPE, pressão atmosférica (hPa).
5. **Energia e Potência das Ondas**: energia das ondas (J/m²), potência das ondas (W/m²).

Aqui estão os dados de exemplo para análise:
6h0.7 m0.6 m12 sS (171°) 6h6h0.6 m12 sS (171°) 6h6h4 km/h 4 km/h NE (52°) 4 km/h ENE 6h24 °C 56% 500 1016 6h2282.2

Por favor, analise os dados fornecidos e dê uma análise detalhada das condições das ondas para surfe, do swell, do vento, do clima e da energia das ondas. 
A análise deve ser feita em linguagem informal e voltada para o público de surf.

Os dados devem ser separados por seções, onde cada seção deve ser um dia da semana.
Antes de iniciar as seções detalhadas por data, forneça um resumo geral indicando os melhores dias para surfar, com base nas condições do swell, vento e clima.
Não inclua a data de ontem, apenas a data de hoje e os próximos dias.
A mensagem deve ser formatada para envio via whatsapp.
`;

export async function surfForecastBuilder(
  content: string,
  senderName: string | undefined,
): Promise<string> {
  try {
    const response = await openAiAPI(GPTModel.GPT4o, [
      {
        role: 'system',
        content:
          'Você é um especialista em analisar condições de surfe a partir de uma base não estruturada de dados meteorológicos e oceanográficos.',
      },
      {
        role: 'user',
        content: context,
      },
      {
        role: 'user',
        content,
      },
      ...(senderName
        ? [
            {
              role: 'user' as const,
              content: `O nome da pessoa que receberá a mensagem é ${senderName}.`,
            },
          ]
        : []),
    ]);

    const surfForecast = response.choices[0]?.message?.content;

    if (!surfForecast) {
      console.error('surfForecast => No content in the response');
      return 'Infelizmente não pudemos encontrar as condições do mar para o pico de surf mencionado. Tente novamente mais tarde.';
    }

    return surfForecast;
  } catch (error) {
    console.error('surfForecast => Error extracting surf spot:', error);
    return 'Não foi possível obter as condições do mar no momento. Tente novamente mais tarde.';
  }
}
