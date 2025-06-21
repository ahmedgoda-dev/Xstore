document.addEventListener('DOMContentLoaded', () => {
  const questions = document.querySelectorAll('.faq-question')

  questions.forEach((question) => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling
      // Optionally close other open items (accordion behavior)
      document.querySelectorAll('.faq-answer').forEach((el) => {
        if (el !== answer) el.classList.remove('open')
      })
      document.querySelectorAll('.faq-question').forEach((el) => {
        if (el !== question) el.classList.remove('open')
      })

      question.classList.toggle('open')
      answer.classList.toggle('open')
    })
  })
})
