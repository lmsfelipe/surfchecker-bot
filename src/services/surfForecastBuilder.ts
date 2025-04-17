import { openAiAPI, GPTModel } from '../interfaces/openAiAPI';

export async function surfForecastBuilder(
  markdownContent: string,
): Promise<string> {
  try {
    const response = await openAiAPI(GPTModel.GPT4o_MINI, [
      {
        role: 'system',
        content: `Você é um assistente que interpreta conteúdos em markdown sobre condições do mar para surfistas.
                  1- Analise o markdown recebido e extraia dados chave como: tamanho da onda, período da onda, direção e intensidade do vento, variação de maré.
                  2- Identifique condições especiais ou avisos relevantes para o pico de surf, como: condições climáticas, raios, ventos fortes, sol, chuva, etc.
                  3- Aponte os melhores horários de surf para os próximos dias, iniciando a partir de hoje.
                  4- Considere que o tamanho das ondas normalmente está em metros.
                  5- Separe as informações por datas, incluindo o dia da semana.
                  6- Use algumas gírias de surfistas e linguagem casual em todo o texto.`,
      },
      {
        role: 'user',
        content: `Interprete o conteúdo markdown abaixo e me forneça um resumo das condições do mar para surfistas, conforme as instruções do role system:\n\n${markdownContent}`,
      },
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
