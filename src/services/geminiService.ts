import { GoogleGenerativeAI } from '@google/generative-ai'

// Cached quizzes to avoid repeated API calls
const quizCache: Record<string, any> = {}

function getApiKey(): string {
    const key = localStorage.getItem('gemini-api-key')
    if (!key) {
        throw new Error('Gemini API key bulunamadı. Lütfen Ayarlar sayfasından API key girin.')
    }
    return key
}

// Fetch YouTube transcript (using a proxy service)
async function fetchYouTubeTranscript(videoId: string): Promise<string> {
    try {
        // Using a public transcript API
        const response = await fetch(
            `https://yt-transcript-api.vercel.app/api/transcript?videoId=${videoId}`
        )

        if (!response.ok) {
            throw new Error('Transcript alınamadı')
        }

        const data = await response.json()

        // Combine transcript segments
        if (Array.isArray(data)) {
            return data.map((segment: any) => segment.text).join(' ')
        }

        return data.transcript || ''
    } catch (error) {
        console.error('Transcript error:', error)
        throw new Error('Video transkripti alınamadı. Manuel test kullanabilirsiniz.')
    }
}

export async function generateQuizFromTranscript(
    videoId: string,
    topicTitle: string,
    keywords: string[]
): Promise<any> {
    // Check cache first
    const cacheKey = `quiz-${videoId}`
    if (quizCache[cacheKey]) {
        return quizCache[cacheKey]
    }

    const apiKey = getApiKey()

    // Try to get transcript
    let context = ''
    try {
        const transcript = await fetchYouTubeTranscript(videoId)
        context = transcript.slice(0, 8000) // Limit to avoid token limits
    } catch {
        // Fallback to keywords if transcript fails
        context = `Konu: ${topicTitle}. Anahtar kelimeler: ${keywords.join(', ')}`
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Sen bir KPSS sınav hazırlık uzmanısın. Aşağıdaki ders içeriğine dayanarak 5 adet çoktan seçmeli soru hazırla.

Konu: ${topicTitle}
İçerik: ${context}

Kurallar:
1. Sorular Türkçe olmalı
2. Her sorunun 4 seçeneği olmalı (A, B, C, D)
3. Sorular KPSS sınavı formatında, net ve anlaşılır olmalı
4. Açıklama kısmında doğru cevabın neden doğru olduğunu kısaca açıkla

Yanıtı SADECE aşağıdaki JSON formatında ver, başka hiçbir şey yazma:
{
  "id": "ai-quiz-${videoId}",
  "title": "${topicTitle} - AI Test",
  "questions": [
    {
      "question": "Soru metni?",
      "options": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
      "correctIndex": 0,
      "explanation": "Doğru cevabın açıklaması"
    }
  ]
}
`

    try {
        const result = await model.generateContent(prompt)
        const response = result.response.text()

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Geçersiz yanıt formatı')
        }

        const quiz = JSON.parse(jsonMatch[0])

        // Validate quiz structure
        if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
            throw new Error('Quiz soruları oluşturulamadı')
        }

        // Cache the result
        quizCache[cacheKey] = quiz

        return quiz
    } catch (error: any) {
        console.error('Gemini error:', error)
        throw new Error(error.message || 'Quiz oluşturulurken bir hata oluştu')
    }
}
