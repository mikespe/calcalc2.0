'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CalCalc
          </h1>
          <p className="text-lg text-gray-600">
            Your comprehensive weight loss and fitness tracking companion
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About This App</h2>
          <p className="text-gray-700 mb-4">
            This website provides useful unopinionated tools like the{' '}
            <Link href="/calorie-calculator" className="text-blue-600 hover:text-blue-800">
              calorie calculator
            </Link>
            ,{' '}
            <Link href="/nutrition-search" className="text-blue-600 hover:text-blue-800">
              nutrition search
            </Link>
            ,{' '}
            <Link href="/calorie-log" className="text-blue-600 hover:text-blue-800">
              calorie log
            </Link>
            {' '}and{' '}
            <Link href="/weight-log" className="text-blue-600 hover:text-blue-800">
              weight log
            </Link>
            {' '}for your fitness journey.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Summary of what is important:</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Calories in vs Calories out</strong> is the most important thing to weight loss
            </p>
            <p>
              You burn calories everyday, eat less than you take in to lose, reverse to gain
            </p>
            <p>
              Roughly 3500 calories = 1 lb. Aim for 1-1.5% of bodyweight lost per week until you're at your goal, 
              then eat at maintenance and enjoy
            </p>
            <p>
              Lift weights or provide resistance to muscle to signal to the body to not eat the muscle and eat the fat instead
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Useful Links & Resources</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Nutrition and Bodybuilding science:</strong>{' '}
              <a 
                href="https://bodyrecomposition.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                https://bodyrecomposition.com/
              </a>
            </li>
            <li>
              <strong>Practical Diet and exercise information:</strong>{' '}
              <a 
                href="https://leangains.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                https://leangains.com/
              </a>
            </li>
            <li>
              <strong>Nutrition and fasting info:</strong>{' '}
              <a 
                href="https://bradpilon.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                https://bradpilon.com/
              </a>
            </li>
            <li>
              <strong>Strength and Powerlifting:</strong>{' '}
              <a 
                href="https://startingstrength.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                https://startingstrength.com/
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
