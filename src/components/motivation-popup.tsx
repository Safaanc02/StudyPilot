"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X, Sparkles } from "lucide-react"
import { useGender } from "@/components/gender-provider"

const quotes = [
  // Success & Achievement
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Your limitation — it's only your imagination.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "If you want to achieve greatness stop asking for permission.", author: "Unknown" },
  { text: "Things work out best for those who make the best of how things work out.", author: "John Wooden" },
  { text: "To live a creative life, we must lose our fear of being wrong.", author: "Joseph Chilton Pearce" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },

  // Education & Learning
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Study hard, for the well is deep, and our brains are shallow.", author: "Richard Baxter" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The educated differ from the uneducated as much as the living from the dead.", author: "Aristotle" },
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },

  // Perseverance & Discipline
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "Perseverance is not a long race; it is many short races one after the other.", author: "Walter Elliot" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "Difficulties in life are intended to make us better, not bitter.", author: "Dan Reeves" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Challenges are what make life interesting and overcoming them is what makes life meaningful.", author: "Joshua J. Marine" },
  { text: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, I will try again tomorrow.", author: "Mary Anne Radmacher" },
  { text: "A river cuts through rock not because of its power but because of its persistence.", author: "Jim Watkins" },

  // Focus & Productivity
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "You don't need more time, you just need to decide.", author: "Seth Godin" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Lost time is never found again.", author: "Benjamin Franklin" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },

  // Mindset & Attitude
  { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "We become what we think about most of the time.", author: "Earl Nightingale" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "You become what you believe.", author: "Oprah Winfrey" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },

  // Wisdom & Life
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "You can never cross the ocean until you have the courage to lose sight of the shore.", author: "Christopher Columbus" },
  { text: "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.", author: "Robert Frost" },
  { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },

  // Courage & Confidence
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "Anais Nin" },
  { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" },
  { text: "Courage is not the absence of fear, but the triumph over it.", author: "Nelson Mandela" },
  { text: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.", author: "Eleanor Roosevelt" },
  { text: "Inaction breeds doubt and fear. Action breeds confidence and courage.", author: "Dale Carnegie" },
  { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
  { text: "Confidence comes not from always being right but from not fearing to be wrong.", author: "Peter T. McIntyre" },
  { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
  { text: "What would you attempt to do if you knew you could not fail?", author: "Robert H. Schuller" },
  { text: "Feel the fear and do it anyway.", author: "Susan Jeffers" },
  { text: "Don't be intimidated by what you don't know. That can be your greatest strength.", author: "Sara Blakely" },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "The brave may not live forever, but the cautious do not live at all.", author: "Richard Branson" },
  { text: "Fortune favors the bold.", author: "Virgil" },

  // Hard Work & Hustle
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Don't wish it were easier. Wish you were better.", author: "Jim Rohn" },
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
  { text: "If people knew how hard I worked to get my mastery, it wouldn't seem so wonderful at all.", author: "Michelangelo" },
  { text: "Talent is cheaper than table salt. What separates the talented individual from the successful one is a lot of hard work.", author: "Stephen King" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { text: "I never dreamed about success. I worked for it.", author: "Estee Lauder" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Hustle until your haters ask if you're hiring.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },

  // Vision & Goals
  { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupery" },
  { text: "Setting goals is the first step in turning the invisible into the visible.", author: "Tony Robbins" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "If you don't build your dream, someone else will hire you to help them build theirs.", author: "Dhirubhai Ambani" },
  { text: "People who are crazy enough to think they can change the world are the ones who do.", author: "Rob Siltanen" },
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { text: "Where there is a will, there is a way.", author: "English Proverb" },
  { text: "Vision without action is merely a dream. Action without vision just passes the time. Vision with action can change the world.", author: "Joel A. Barker" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "Set your goals high, and don't stop till you get there.", author: "Bo Jackson" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "If you aim at nothing, you will hit it every time.", author: "Zig Ziglar" },
  { text: "It's hard to beat a person who never gives up.", author: "Babe Ruth" },

  // Self-Improvement & Growth
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  { text: "Don't go through life, grow through life.", author: "Eric Butterworth" },
  { text: "The only person you should try to be better than is the person you were yesterday.", author: "Unknown" },
  { text: "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.", author: "Mandy Hale" },
  { text: "Every master was once a disaster.", author: "T. Harv Eker" },
  { text: "The biggest room in the world is the room for improvement.", author: "Helmut Schmidt" },
  { text: "Progress is impossible without change, and those who cannot change their minds cannot change anything.", author: "George Bernard Shaw" },
  { text: "If you want something you've never had, you must be willing to do something you've never done.", author: "Thomas Jefferson" },
  { text: "Become the person who would attract the results you seek.", author: "Jim Cathcart" },
  { text: "Invest in yourself. Your career is the engine of your wealth.", author: "Paul Clitheroe" },
  { text: "To improve is to change; to be perfect is to change often.", author: "Winston Churchill" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },

  // Leadership & Impact
  { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The price of greatness is responsibility.", author: "Winston Churchill" },
  { text: "If your actions inspire others to dream more, learn more, do more and become more, you are a leader.", author: "John Quincy Adams" },
  { text: "Alone we can do so little; together we can do so much.", author: "Helen Keller" },
  { text: "The greatest leader is not the one who does the greatest things, but the one who gets people to do the greatest things.", author: "Ronald Reagan" },
  { text: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.", author: "Jack Welch" },
  { text: "Management is doing things right; leadership is doing the right things.", author: "Peter Drucker" },
  { text: "Don't follow the crowd, let the crowd follow you.", author: "Margaret Thatcher" },
  { text: "You manage things; you lead people.", author: "Grace Hopper" },

  // Resilience & Overcoming
  { text: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling" },
  { text: "The world breaks everyone, and afterward, some are strong at the broken places.", author: "Ernest Hemingway" },
  { text: "Out of your vulnerabilities will come your strength.", author: "Sigmund Freud" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "You may have to fight a battle more than once to win it.", author: "Margaret Thatcher" },
  { text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Henry Ford" },
  { text: "Tough times never last, but tough people do.", author: "Robert H. Schuller" },
  { text: "The human capacity for burden is like bamboo — far more flexible than you'd ever believe at first glance.", author: "Jodi Picoult" },
  { text: "What doesn't kill you makes you stronger.", author: "Friedrich Nietzsche" },
  { text: "Stars can't shine without darkness.", author: "Unknown" },

  // Creativity & Innovation
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "The chief enemy of creativity is good sense.", author: "Pablo Picasso" },
  { text: "Every child is an artist. The problem is how to remain an artist once we grow up.", author: "Pablo Picasso" },
  { text: "Imagination is the beginning of creation.", author: "George Bernard Shaw" },
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
  { text: "Creativity takes courage.", author: "Henri Matisse" },
  { text: "The desire to create is one of the deepest yearnings of the human soul.", author: "Dieter F. Uchtdorf" },
  { text: "Don't think. Thinking is the enemy of creativity.", author: "Ray Bradbury" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
  { text: "Innovation is seeing what everybody has seen and thinking what nobody has thought.", author: "Albert Szent-Gyorgyi" },

  // Student Life & Study
  { text: "The more I study, the more I know. The more I know, the more I forget. The more I forget, the less I know. So why study?", author: "Unknown" },
  { text: "I am still learning.", author: "Michelangelo" },
  { text: "Studying is not about reading, it is about understanding.", author: "Unknown" },
  { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
  { text: "The brain is like a muscle. When it is in use we feel very good.", author: "Carl Sagan" },
  { text: "There is no elevator to success. You have to take the stairs.", author: "Zig Ziglar" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't let your learning lead to knowledge. Let your learning lead to action.", author: "Jim Rohn" },
  { text: "An ounce of practice is worth more than tons of preaching.", author: "Mahatma Gandhi" },
  { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { text: "The beginning is the most important part of the work.", author: "Plato" },
  { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
  { text: "Study without desire spoils the memory, and it retains nothing that it takes in.", author: "Leonardo da Vinci" },
  { text: "I think, therefore I am.", author: "Rene Descartes" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
]

export function MotivationPopup() {
  const [visible, setVisible] = useState(false)
  const [quote, setQuote] = useState(quotes[0])
  const [exiting, setExiting] = useState(false)
  const gender = useGender()
  const pathname = usePathname()

  // Only show on app pages (not landing, not onboarding)
  const isAppPage = pathname?.startsWith("/dashboard") || pathname?.startsWith("/lesson-ai") || pathname?.startsWith("/planner") || pathname?.startsWith("/assignments") || pathname?.startsWith("/pdf-tools") || pathname?.startsWith("/resume") || pathname?.startsWith("/internships") || pathname?.startsWith("/notes") || pathname?.startsWith("/upgrade")

  useEffect(() => {
    if (!isAppPage) return

    const showQuote = () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(randomQuote)
      setExiting(false)
      setVisible(true)
    }

    // Show first one after 20s, then every 2 min
    const initialTimeout = setTimeout(showQuote, 20000)
    const interval = setInterval(showQuote, 120000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [isAppPage])

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => setVisible(false), 300)
  }

  // Auto-dismiss after 8s
  useEffect(() => {
    if (!visible || exiting) return
    const timer = setTimeout(handleClose, 8000)
    return () => clearTimeout(timer)
  }, [visible, exiting])

  if (!visible || !isAppPage) return null

  const accentClass = gender === "female"
    ? "from-pink-500 to-rose-500"
    : gender === "male"
      ? "from-blue-600 to-indigo-600"
      : "from-violet-500 to-purple-600"

  const bgClass = gender === "female"
    ? "bg-pink-50 border-pink-200"
    : gender === "male"
      ? "bg-blue-50 border-blue-200"
      : "bg-violet-50 border-violet-200"

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-300 ${
        exiting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0 animate-slide-up"
      }`}
    >
      <div className={`rounded-xl border shadow-lg overflow-hidden ${bgClass}`}>
        {/* Accent bar */}
        <div className={`h-1 bg-gradient-to-r ${accentClass}`} />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${accentClass} flex items-center justify-center shrink-0 mt-0.5`}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
              <p className="text-xs text-muted-foreground mt-1.5">— {quote.author}</p>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
