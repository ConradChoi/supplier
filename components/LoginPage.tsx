'use client'

import React, { useState } from 'react'
import './LoginPage.css'

// 다국어 텍스트 정의
const translations = {
  ko: {
    title: 'SSM',
    subtitle: 'Seepn Suppliers Management',
    username: '공급사 아이디',
    password: '공급사 비밀번호',
    usernamePlaceholder: '아이디를 입력하세요',
    passwordPlaceholder: '비밀번호를 입력하세요',
    rememberId: '아이디 저장',
    findId: '아이디 찾기',
    findPassword: '비밀번호 찾기',
    login: '로그인',
    signupText: '처음이신가요?',
    signup: '회원가입',
    bannerTitle: 'SEEPN',
    bannerSubtitle: '한국 최초 공급사 검색 서비스',
    bannerDescription: '공급사가 주인공이 되는 B2B 검색 플랫폼, Seepn에서 시작하세요.'
  },
  en: {
    title: 'SSM',
    subtitle: 'Seepn Suppliers Management',
    username: 'Supplier ID',
    password: 'Supplier Password',
    usernamePlaceholder: 'Enter your ID',
    passwordPlaceholder: 'Enter your password',
    rememberId: 'Remember ID',
    findId: 'Find ID',
    findPassword: 'Find Password',
    login: 'Login',
    signupText: 'First time here?',
    signup: 'Sign Up',
    bannerTitle: 'SEEPN',
    bannerSubtitle: 'Korea\'s First Supplier Search Service',
    bannerDescription: 'Start with Seepn, the B2B search platform where suppliers are the protagonists.'
  },
  ja: {
    title: 'SSM',
    subtitle: 'Seepn Suppliers Management',
    username: '供給者ID',
    password: '供給者パスワード',
    usernamePlaceholder: 'IDを入力してください',
    passwordPlaceholder: 'パスワードを入力してください',
    rememberId: 'IDを保存',
    findId: 'IDを探す',
    findPassword: 'パスワードを探す',
    login: 'ログイン',
    signupText: '初めてですか？',
    signup: '会員登録',
    bannerTitle: 'SEEPN',
    bannerSubtitle: '韓国初の供給者検索サービス',
    bannerDescription: '供給者が主人公となるB2B検索プラットフォーム、Seepnで始めましょう。'
  },
  zh: {
    title: 'SSM',
    subtitle: 'Seepn Suppliers Management',
    username: '供应商ID',
    password: '供应商密码',
    usernamePlaceholder: '请输入ID',
    passwordPlaceholder: '请输入密码',
    rememberId: '保存ID',
    findId: '查找ID',
    findPassword: '查找密码',
    login: '登录',
    signupText: '第一次使用？',
    signup: '注册',
    bannerTitle: 'SEEPN',
    bannerSubtitle: '韩国首个供应商搜索服务',
    bannerDescription: '供应商成为主角的B2B搜索平台，从Seepn开始。'
  }
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberId: false
  })

  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en' | 'ja' | 'zh'>('ko')

  const t = translations[currentLanguage]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', formData)
  }

  const handleFindId = () => {
    console.log('Find ID clicked')
  }

  const handleFindPassword = () => {
    console.log('Find Password clicked')
  }

  const handleSignup = () => {
    console.log('Signup clicked')
  }

  const handleLanguageChange = (language: 'ko' | 'en' | 'ja' | 'zh') => {
    setCurrentLanguage(language)
  }

  return (
    <div className="login-container">
      {/* Left 영역 - 이미지/배너 */}
      <div className="banner-section">
        <div className="banner-content">
          <div className="banner-text-content">
            <h1 className="banner-main-title">{t.bannerTitle}</h1>
            <p className="banner-main-subtitle">{t.bannerSubtitle}</p>
            <p className="banner-main-description">{t.bannerDescription}</p>
          </div>
        </div>
      </div>

      {/* Right 영역 - 로그인 폼 */}
      <div className="login-section">
        <div className="login-form-container">
          <div className="login-title-container">
            <h2 className="login-title">{t.title}</h2>
            <p className="login-subtitle">{t.subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">{t.username}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={t.usernamePlaceholder}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.password}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t.passwordPlaceholder}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberId"
                  checked={formData.rememberId}
                  onChange={handleInputChange}
                />
                <span>{t.rememberId}</span>
              </label>
              <div className="find-links">
                <button 
                  type="button" 
                  className="find-link"
                  onClick={handleFindId}
                >
                  {t.findId}
                </button>
                <span className="separator">|</span>
                <button 
                  type="button" 
                  className="find-link"
                  onClick={handleFindPassword}
                >
                  {t.findPassword}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              {t.login}
            </button>

            <div className="signup-section">
              <span>{t.signupText} </span>
              <button 
                type="button" 
                className="signup-link"
                onClick={handleSignup}
              >
                {t.signup}
              </button>
            </div>

            {/* 다국어 선택 */}
            <div className="language-selector">
              <button
                type="button"
                className={`language-btn ${currentLanguage === 'ko' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('ko')}
              >
                한국어
              </button>
              <button
                type="button"
                className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                English
              </button>
              <button
                type="button"
                className={`language-btn ${currentLanguage === 'ja' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('ja')}
              >
                日本語
              </button>
              <button
                type="button"
                className={`language-btn ${currentLanguage === 'zh' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('zh')}
              >
                中文
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
