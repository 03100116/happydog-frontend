import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../utils'

const MONTHLY_PLANS = [
  {
    name: '免费版',
    price: '¥0',
    period: '',
    badge: '',
    popular: false,
    best: false,
    btnText: '当前订阅',
    btnClass: '',
    bgClass: 'green-bg',
    details: [],
    features: [
      { text: '每日登录免费积分', on: true },
      { text: '最多 2 个并发任务', on: true },
      { text: '下载MP3', on: true },
      { text: '下载WAV', on: false },
      { text: '优先生成队列', on: false },
      { text: '生成歌曲可商用', on: false },
      { text: '抢先体验新模型、新功能', on: false },
    ]
  },
  {
    name: '标准会员',
    price: '¥15.9',
    period: '/月',
    badge: '最受欢迎',
    popular: true,
    best: false,
    btnText: '订阅',
    btnClass: '',
    bgClass: 'peach-bg',
    details: ['每月 3000 积分，约可生成 150 首歌曲', '每100积分 ¥1.00'],
    features: [
      { text: '每日登录免费积分', on: true },
      { text: '最多 4 个并发任务', on: true },
      { text: '下载MP3', on: true },
      { text: '下载WAV', on: true },
      { text: '优先生成队列', on: true },
      { text: '生成歌曲可商用', on: false },
      { text: '抢先体验新模型、新功能', on: false },
    ]
  },
  {
    name: '专业会员',
    price: '¥99.9',
    period: '/月',
    badge: '最划算',
    popular: false,
    best: true,
    btnText: '订阅',
    btnClass: 'pink',
    bgClass: 'pink-bg',
    details: ['每月 16000 积分，约可生成 880 首歌曲', '每100积分 ¥0.75'],
    features: [
      { text: '每日登录免费积分', on: true },
      { text: '最多 6 个并发任务', on: true },
      { text: '下载MP3', on: true },
      { text: '下载WAV', on: true },
      { text: '优先生成队列（速度最快）', on: true },
      { text: '生成歌曲可商用', on: true },
      { text: '抢先体验新模型、新功能', on: true },
    ]
  },
]

const YEARLY_PLANS = [
  {
    name: '免费版',
    price: '¥0',
    period: '',
    badge: '',
    popular: false,
    best: false,
    btnText: '当前订阅',
    btnClass: '',
    bgClass: 'green-bg',
    details: [],
    features: [
      { text: '每日登录免费积分', on: true },
      { text: '最多 2 个并发任务', on: true },
      { text: '下载MP3', on: true },
      { text: '下载WAV', on: false },
      { text: '优先生成队列', on: false },
      { text: '生成歌曲可商用', on: false },
      { text: '抢先体验新模型、新功能', on: false },
    ]
  },
  {
    name: '标准会员',
    price: '¥149.9',
    period: '/年',
    badge: '最受欢迎',
    popular: true,
    best: false,
    btnText: '订阅',
    btnClass: '',
    bgClass: 'peach-bg',
    details: ['每月 3800 积分，约可生成 150 首歌曲', '每100积分 ¥0.80'],
    features: [
      { text: '每日登录免费积分', on: true },
      { text: '最多 4 个并发任务', on: true },
      { text: '下载MP3', on: true },
      { text: '下载WAV', on: true },
      { text: '优先生成队列', on: true },
      { text: '生成歌曲可商用', on: false },
      { text: '抢先体验新模型、新功能', on: false },
    ]
  },
  {
    name: '专业会员',
    price: '¥999.9',
    period: '/年',
    badge: '最划算',
    popular: false,
    best: true,
    btnText: '订阅',
    btnClass: 'pink',
    bgClass: 'pink-bg',
    details: ['每月 16000 积分，约可生成 800 首歌曲', '每100积分 ¥0.60'],
    features: [
      { text: '每日登录免费积分', on: true },
      { text: '最多 6 个并发任务', on: true },
      { text: '下载MP3', on: true },
      { text: '下载WAV', on: true },
      { text: '优先生成队列（速度最快）', on: true },
      { text: '生成歌曲可商用', on: true },
      { text: '抢先体验新模型、新功能', on: true },
    ]
  },
]

export default function Pricing() {
  const [tab, setTab] = useState('monthly')
  const navigate = useNavigate()
  const plans = tab === 'monthly' ? MONTHLY_PLANS : YEARLY_PLANS

  return (
    <div className="pricing-page" style={{ position: 'relative' }}>
      <button onClick={() => navigate(-1)} style={{
        position: 'absolute', top: 0, right: 0,
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(0,0,0,.06)', border: 'none',
        color: 'var(--text2)', fontSize: 16, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s'
      }} onMouseEnter={e => e.target.style.background = 'rgba(0,0,0,.12)'}
         onMouseLeave={e => e.target.style.background = 'rgba(0,0,0,.06)'}
      >✕</button>
      <h2 className="pricing-title">选择适合你的方案 🐕</h2>
      <p className="pricing-sub">解锁更多创作能力，让 Every dog has its day</p>

      <div className="pricing-tabs">
        <button className={`pricing-tab${tab === 'monthly' ? ' active' : ''}`} onClick={() => setTab('monthly')}>连续包月</button>
        <button className={`pricing-tab${tab === 'yearly' ? ' active' : ''}`} onClick={() => setTab('yearly')}>连续包年</button>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <div key={i} className={`price-card ${plan.bgClass}`}>
            <div className="price-labels">
              <span className="price-label">{plan.name}</span>
              {plan.popular && <span className="price-label pink">最受欢迎</span>}
              {plan.best && <span className="price-label gray">最划算</span>}
            </div>
            <div className="price-amount">
              {plan.price}<span>{plan.period}</span>
            </div>
            {plan.details.map((d, j) => (
              <div key={j} className="price-detail">• {d}</div>
            ))}
            <button className={`price-btn ${plan.btnClass}`} onClick={() => showToast(`${plan.name} 订阅功能即将上线`, 'info')}>
              {plan.btnText}
            </button>
            <ul className="price-features">
              {plan.features.map((f, j) => (
                <li key={j} className={`price-feature${f.on ? '' : ' off'}`}>
                  <span className="price-check">{f.on ? '✓' : '—'}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}