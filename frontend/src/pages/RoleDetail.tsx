import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const roleData = {
  'frontend-dev': {
    name: 'Frontend Developer',
    description: 'Frontend Developers build the visual elements of web applications that users interact with. They work closely with designers and backend developers to create seamless user experiences.',
    dayInLife: [
      'Write clean, maintainable code using HTML, CSS, and JavaScript',
      'Build responsive and interactive user interfaces',
      'Implement modern frontend frameworks and libraries',
      'Optimize applications for performance and accessibility',
      'Collaborate with designers and backend developers',
    ],
    skills: [
      { name: 'HTML5', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'CSS3', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
      { name: 'JavaScript', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'React', link: 'https://react.dev/' },
      { name: 'TypeScript', link: 'https://www.typescriptlang.org/' },
      { name: 'Responsive Design', link: 'https://www.freecodecamp.org/news/learn-responsive-design/' },
    ],
    roadmap: [
      'Learn HTML5 fundamentals and semantic markup',
      'Master CSS3 including Flexbox and Grid',
      'Study JavaScript basics and ES6+ features',
      'Learn React fundamentals and hooks',
      'Understand state management (Redux/Context)',
      'Master TypeScript and type safety',
      'Learn testing with Jest and React Testing Library',
      'Study performance optimization techniques',
      'Learn about accessibility (a11y)',
      'Master modern build tools (Webpack/Vite)',
    ],
    resources: [
      { name: 'MDN Web Docs', link: 'https://developer.mozilla.org/' },
      { name: 'freeCodeCamp', link: 'https://www.freecodecamp.org/' },
      { name: 'Frontend Mentor', link: 'https://www.frontendmentor.io/' },
      { name: 'React Documentation', link: 'https://react.dev/' },
      { name: 'TypeScript Handbook', link: 'https://www.typescriptlang.org/docs/' },
    ],
    skillsMatrix: [
      { skill: 'HTML5', level: 3 },
      { skill: 'CSS3', level: 3 },
      { skill: 'JavaScript', level: 3 },
      { skill: 'React', level: 3 },
      { skill: 'TypeScript', level: 2 },
      { skill: 'Testing', level: 2 },
    ],
  }
};

export default function RoleDetail() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [selfAssessment, setSelfAssessment] = useState<{ [skill: string]: number }>({});
  const role = roleData[roleId as keyof typeof roleData];

  if (!role) return <div className="p-10 text-center text-gray-500">Role not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <button onClick={() => navigate('/roles')} className="mb-6 text-cyan-500 hover:underline">&larr; Back to Roles</button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{role.name}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{role.description}</p>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">A Day in the Life</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          {role.dayInLife.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h2>
        <ul className="flex flex-wrap gap-3 mb-6">
          {role.skills.map(skill => (
            <li key={skill.name}>
              <a href={skill.link} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full hover:underline text-sm">{skill.name}</a>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Learning Roadmap</h2>
        <ol className="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300">
          {role.roadmap.map((step, i) => <li key={i}>{step}</li>)}
        </ol>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Recommended Resources</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          {role.resources.map(res => (
            <li key={res.name}><a href={res.link} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">{res.name}</a></li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Skills Matrix & Self-Assessment</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-3">Skill</th>
                <th className="py-2 px-3">Recommended Level</th>
                <th className="py-2 px-3">Your Level</th>
              </tr>
            </thead>
            <tbody>
              {role.skillsMatrix.map(row => (
                <tr key={row.skill} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">{row.skill}</td>
                  <td className="py-2 px-3">{'★'.repeat(row.level)}{'☆'.repeat(3 - row.level)}</td>
                  <td className="py-2 px-3">
                    <select
                      value={selfAssessment[row.skill] || 0}
                      onChange={e => setSelfAssessment({ ...selfAssessment, [row.skill]: Number(e.target.value) })}
                      className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value={0}>Not started</option>
                      <option value={1}>Beginner</option>
                      <option value={2}>Intermediate</option>
                      <option value={3}>Advanced</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 