'use client'

import React, { useState } from 'react'
import './SignupPage.css'

// 다국어 텍스트 정의
const translations = {
  ko: {
    title: '회원가입',
    subtitle: 'SSM - Seepn Suppliers Management',
    backToLogin: '로그인으로 돌아가기',
    
    // 회원 구분
    memberType: '회원 구분 선택',
    individual: '개인사업자',
    corporate: '법인사업자',
    
    // 약관 동의
    termsTitle: '약관 동의',
    allAgree: '전체 동의',
    termsOfService: '이용약관 동의',
    privacyPolicy: '개인정보 수집 및 이용 동의',
    
    // 회사 정보
    companyInfo: '회사 정보',
    businessNumber: '사업자번호',
    businessNumberPlaceholder: '사업자번호를 입력하세요 (예: 123-45-67890)',
    checkDuplicate: '중복체크',
    businessType: '대표 업종',
    businessTypePlaceholder: '업종을 입력하세요',
    businessCategory: '대표 업태',
    businessCategoryPlaceholder: '업태를 입력하세요',
    representativeName: '대표자명',
    representativeNamePlaceholder: '대표자명을 입력하세요',
    representativePhone: '대표 전화번호',
    representativePhonePlaceholder: '전화번호를 입력하세요',
    representativeEmail: '대표 이메일 주소',
    representativeEmailPlaceholder: '이메일을 입력하세요',
    companyAddress: '회사 주소',
    companyAddressPlaceholder: '회사 주소를 입력하세요',
    homepage: '홈페이지 주소',
    homepagePlaceholder: '홈페이지 주소를 입력하세요 (선택사항)',
    
    // 관련 서류
    documents: '관련 서류 업로드',
    businessLicense: '사업자등록증 사본',
    representativeId: '대표자 신분증 사본',
    sealCertificate: '인감증명서 사본',
    uploadFile: '파일 선택',
    noFileSelected: '선택된 파일 없음',
    
    // 담당자 정보
    managerInfo: '담당자 정보',
    username: '아이디',
    usernamePlaceholder: '아이디를 입력하세요',
    password: '비밀번호',
    passwordPlaceholder: '비밀번호를 입력하세요',
    confirmPassword: '비밀번호 재입력',
    confirmPasswordPlaceholder: '비밀번호를 다시 입력하세요',
    managerName: '담당자명',
    managerNamePlaceholder: '담당자명을 입력하세요',
    sameAsRepresentative: '대표와 동일',
    managerPhone: '담당자 전화번호',
    managerPhonePlaceholder: '전화번호를 입력하세요',
    managerMobile: '담당자 휴대폰번호',
    managerMobilePlaceholder: '휴대폰번호를 입력하세요',
    managerEmail: '담당자 이메일 주소',
    managerEmailPlaceholder: '이메일을 입력하세요',
    
    // 버튼
    signup: '회원가입',
    cancel: '취소',
    
    // 메시지
    passwordMismatch: '비밀번호가 일치하지 않습니다.',
    allFieldsRequired: '모든 필수 항목을 입력해주세요.',
    duplicateCheckRequired: '사업자번호 중복체크를 해주세요.',
    termsRequired: '필수 약관에 동의해주세요.',
    signupSuccess: '회원가입이 완료되었습니다.',
    signupFailed: '회원가입에 실패했습니다.'
  }
}

const SignupPage: React.FC = () => {
  const [memberType, setMemberType] = useState<'individual' | 'corporate'>('individual')
  const [formData, setFormData] = useState({
    // 약관 동의
    allAgree: false,
    termsOfService: false,
    privacyPolicy: false,
    
    // 회사 정보
    businessNumber: '',
    businessType: '',
    businessCategory: '',
    representativeName: '',
    representativePhone: '',
    representativeEmail: '',
    companyAddress: '',
    homepage: '',
    
    // 담당자 정보
    username: '',
    password: '',
    confirmPassword: '',
    managerName: '',
    sameAsRepresentative: false,
    managerPhone: '',
    managerMobile: '',
    managerEmail: ''
  })
  
  const [files, setFiles] = useState({
    businessLicense: null as File | null,
    representativeId: null as File | null,
    sealCertificate: null as File | null
  })
  
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTermsExpanded, setIsTermsExpanded] = useState(false)
  const [isUsernameChecked, setIsUsernameChecked] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    complexity: false,
    sequence: false
  })

  // 약관 동의와 회원 구분 선택 완료 여부 확인
  const isInitialStepCompleted = formData.termsOfService && formData.privacyPolicy && memberType

  const t = translations.ko

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // 사업자번호 자동 중복체크
    if (name === 'businessNumber') {
      checkBusinessNumberDuplicate(value)
    }

    // 아이디 자동 중복체크
    if (name === 'username') {
      checkUsernameDuplicate(value)
    }

    // 비밀번호 유효성 검사
    if (name === 'password') {
      validatePassword(value)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof typeof files) => {
    const file = e.target.files?.[0] || null
    setFiles(prev => ({ ...prev, [fileType]: file }))
  }

  const handleAllAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFormData(prev => ({
      ...prev,
      allAgree: checked,
      termsOfService: checked,
      privacyPolicy: checked
    }))
  }

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      allAgree: prev.termsOfService && prev.privacyPolicy && checked
    }))
  }

  const handleSameAsRepresentative = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFormData(prev => ({
      ...prev,
      sameAsRepresentative: checked,
      managerName: checked ? prev.representativeName : '',
      managerPhone: checked ? prev.representativePhone : '',
      managerMobile: checked ? prev.representativePhone : '',
      managerEmail: checked ? prev.representativeEmail : ''
    }))
  }

  const checkDuplicate = async () => {
    if (!formData.businessNumber) {
      setErrors(prev => ({ ...prev, businessNumber: '사업자번호를 입력해주세요.' }))
      return
    }
    
    // 실제 중복체크 API 호출 로직
    try {
      // 임시로 성공 처리
      setIsDuplicateChecked(true)
      setErrors(prev => ({ ...prev, businessNumber: '' }))
      alert('사용 가능한 사업자번호입니다.')
    } catch (error) {
      setErrors(prev => ({ ...prev, businessNumber: '중복체크에 실패했습니다.' }))
    }
  }

  const checkBusinessNumberDuplicate = async (businessNumber: string) => {
    if (!businessNumber || businessNumber.length < 10) return
    
    try {
      // 실제 중복체크 API 호출 로직
      await new Promise(resolve => setTimeout(resolve, 500)) // 임시 지연
      setIsDuplicateChecked(true)
      setErrors(prev => ({ ...prev, businessNumber: '' }))
    } catch (error) {
      setIsDuplicateChecked(false)
      setErrors(prev => ({ ...prev, businessNumber: '중복체크에 실패했습니다.' }))
    }
  }

  const checkUsernameDuplicate = async (username: string) => {
    if (!username || username.length < 3) return
    
    try {
      // 실제 중복체크 API 호출 로직
      await new Promise(resolve => setTimeout(resolve, 300)) // 임시 지연
      setIsUsernameChecked(true)
      setErrors(prev => ({ ...prev, username: '' }))
    } catch (error) {
      setIsUsernameChecked(false)
      setErrors(prev => ({ ...prev, username: '중복체크에 실패했습니다.' }))
    }
  }

  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8 && password.length <= 20,
      complexity: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password),
      sequence: !/(.)\1{2,}|(?:123|234|345|456|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)
    }
    
    setPasswordValidation(validations)
    return Object.values(validations).every(Boolean)
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    // 필수 약관 체크
    if (!formData.termsOfService || !formData.privacyPolicy) {
      newErrors.terms = t.termsRequired
    }
    
    // 사업자번호 중복체크
    if (!isDuplicateChecked) {
      newErrors.businessNumber = t.duplicateCheckRequired
    }
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch
    }
    
    // 필수 필드 검증
    const requiredFields = [
      'businessNumber', 'businessType', 'businessCategory', 'representativeName',
      'representativePhone', 'representativeEmail', 'companyAddress',
      'username', 'password', 'confirmPassword', 'managerName'
    ]
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = '필수 입력 항목입니다.'
      }
    })
    
    // 담당자 정보 검증 (대표와 동일이 아닌 경우)
    if (!formData.sameAsRepresentative) {
      if (!formData.managerPhone) newErrors.managerPhone = '필수 입력 항목입니다.'
      if (!formData.managerMobile) newErrors.managerMobile = '필수 입력 항목입니다.'
      if (!formData.managerEmail) newErrors.managerEmail = '필수 입력 항목입니다.'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 실제 회원가입 API 호출 로직
      await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 지연
      
      alert(t.signupSuccess)
      // 로그인 페이지로 이동
      window.location.href = '/'
    } catch (error) {
      alert(t.signupFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('회원가입을 취소하시겠습니까?')) {
      window.location.href = '/'
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>SSM 회원가입</h1>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* 약관 동의 */}
        <div className="form-section">
          <h2>{t.termsTitle}</h2>
          <div className="terms-agreement">
            <div className="terms-header">
              <label className="checkbox-label all-agree">
                <input
                  type="checkbox"
                  name="allAgree"
                  checked={formData.allAgree}
                  onChange={handleAllAgreeChange}
                />
                <span className="checkmark"></span>
                <strong>{t.allAgree}</strong>
              </label>
              <button
                type="button"
                className="terms-toggle-btn"
                onClick={() => setIsTermsExpanded(!isTermsExpanded)}
              >
                <span className={`arrow-icon ${isTermsExpanded ? 'expanded' : ''}`}>
                  ▼
                </span>
              </button>
            </div>
            
            {isTermsExpanded && (
              <div className="terms-details">
                <div className="terms-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="termsOfService"
                      checked={formData.termsOfService}
                      onChange={handleTermsChange}
                    />
                    <span className="checkmark"></span>
                    {t.termsOfService}
                  </label>
                  <span className="view-terms-link" onClick={() => alert('이용약관 보기')}>
                    보기
                  </span>
                </div>
                <div className="terms-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="privacyPolicy"
                      checked={formData.privacyPolicy}
                      onChange={handleTermsChange}
                    />
                    <span className="checkmark"></span>
                    {t.privacyPolicy}
                  </label>
                  <span className="view-terms-link" onClick={() => alert('개인정보 수집 및 이용 동의 보기')}>
                    보기
                  </span>
                </div>
              </div>
            )}
          </div>
          {errors.terms && <div className="error-message">{errors.terms}</div>}
        </div>

        {/* 회원 구분 선택 */}
        <div className="form-section">
          <h2>{t.memberType}</h2>
          <div className="member-type-selector">
            <label className="member-type-option">
              <input
                type="radio"
                name="memberType"
                value="individual"
                checked={memberType === 'individual'}
                onChange={() => setMemberType('individual')}
              />
              <span className="radio-custom"></span>
              {t.individual}
            </label>
            <label className="member-type-option">
              <input
                type="radio"
                name="memberType"
                value="corporate"
                checked={memberType === 'corporate'}
                onChange={() => setMemberType('corporate')}
              />
              <span className="radio-custom"></span>
              {t.corporate}
            </label>
          </div>
        </div>

        {/* 회사 정보 */}
        {isInitialStepCompleted && (
          <div className="form-section">
            <h2>{t.companyInfo}</h2>
            
            <div className="form-row">
              <div className="form-group business-number-group">
                <label htmlFor="businessNumber">{t.businessNumber} *</label>
                <input
                  type="text"
                  id="businessNumber"
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleInputChange}
                  placeholder={t.businessNumberPlaceholder}
                  className={errors.businessNumber ? 'error' : ''}
                />
                {isDuplicateChecked && <span className="check-success">✓ 사용 가능</span>}
                {errors.businessNumber && <div className="error-message">{errors.businessNumber}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessType">{t.businessType} *</label>
                <input
                  type="text"
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder={t.businessTypePlaceholder}
                  className={errors.businessType ? 'error' : ''}
                />
                {errors.businessType && <div className="error-message">{errors.businessType}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="businessCategory">{t.businessCategory} *</label>
                <input
                  type="text"
                  id="businessCategory"
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleInputChange}
                  placeholder={t.businessCategoryPlaceholder}
                  className={errors.businessCategory ? 'error' : ''}
                />
                {errors.businessCategory && <div className="error-message">{errors.businessCategory}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="representativeName">{t.representativeName} *</label>
                <input
                  type="text"
                  id="representativeName"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                  placeholder={t.representativeNamePlaceholder}
                  className={errors.representativeName ? 'error' : ''}
                />
                {errors.representativeName && <div className="error-message">{errors.representativeName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="representativePhone">{t.representativePhone} *</label>
                <input
                  type="tel"
                  id="representativePhone"
                  name="representativePhone"
                  value={formData.representativePhone}
                  onChange={handleInputChange}
                  placeholder={t.representativePhonePlaceholder}
                  className={errors.representativePhone ? 'error' : ''}
                />
                {errors.representativePhone && <div className="error-message">{errors.representativePhone}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="representativeEmail">{t.representativeEmail} *</label>
                <input
                  type="email"
                  id="representativeEmail"
                  name="representativeEmail"
                  value={formData.representativeEmail}
                  onChange={handleInputChange}
                  placeholder={t.representativeEmailPlaceholder}
                  className={errors.representativeEmail ? 'error' : ''}
                />
                {errors.representativeEmail && <div className="error-message">{errors.representativeEmail}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="homepage">{t.homepage}</label>
                <input
                  type="url"
                  id="homepage"
                  name="homepage"
                  value={formData.homepage}
                  onChange={handleInputChange}
                  placeholder={t.homepagePlaceholder}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="companyAddress">{t.companyAddress} *</label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                placeholder={t.companyAddressPlaceholder}
                className={errors.companyAddress ? 'error' : ''}
              />
              {errors.companyAddress && <div className="error-message">{errors.companyAddress}</div>}
            </div>

            {/* 관련 서류 업로드 */}
            <div className="form-group">
              <label>{t.documents}</label>
              <div className="file-upload-section">
                <div className="file-upload-item">
                  <label htmlFor="businessLicense">{t.businessLicense} *</label>
                  <input
                    type="file"
                    id="businessLicense"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'businessLicense')}
                  />
                  <span className="file-name">
                    {files.businessLicense ? files.businessLicense.name : t.noFileSelected}
                  </span>
                </div>
                
                <div className="file-upload-item">
                  <label htmlFor="representativeId">{t.representativeId} *</label>
                  <input
                    type="file"
                    id="representativeId"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'representativeId')}
                  />
                  <span className="file-name">
                    {files.representativeId ? files.representativeId.name : t.noFileSelected}
                  </span>
                </div>
                
                {memberType === 'corporate' && (
                  <div className="file-upload-item">
                    <label htmlFor="sealCertificate">{t.sealCertificate} *</label>
                    <input
                      type="file"
                      id="sealCertificate"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'sealCertificate')}
                    />
                    <span className="file-name">
                      {files.sealCertificate ? files.sealCertificate.name : t.noFileSelected}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 담당자 정보 */}
        {isInitialStepCompleted && (
          <div className="form-section">
            <h2>{t.managerInfo}</h2>
            
            <div className="form-group">
              <label htmlFor="username">{t.username} *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={t.usernamePlaceholder}
                className={errors.username ? 'error' : ''}
              />
              {isUsernameChecked && <span className="check-success">✓ 사용 가능</span>}
              {errors.username && <div className="error-message">{errors.username}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">{t.password} *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t.passwordPlaceholder}
                  className={errors.password ? 'error' : ''}
                />
                {formData.password && (
                  <div className="password-validation">
                    <div className={`validation-item ${passwordValidation.length ? 'valid' : 'invalid'}`}>
                      {passwordValidation.length ? '✓' : '✗'} 8-20자
                    </div>
                    <div className={`validation-item ${passwordValidation.complexity ? 'valid' : 'invalid'}`}>
                      {passwordValidation.complexity ? '✓' : '✗'} 영문대소문자, 숫자, 특수문자
                    </div>
                    <div className={`validation-item ${passwordValidation.sequence ? 'valid' : 'invalid'}`}>
                      {passwordValidation.sequence ? '✓' : '✗'} 연속된 문자/숫자 제외
                    </div>
                  </div>
                )}
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">{t.confirmPassword} *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t.confirmPasswordPlaceholder}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="form-group manager-name-group">
              <label htmlFor="managerName">{t.managerName} *</label>
              <div className="manager-name-input">
                <input
                  type="text"
                  id="managerName"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  placeholder={t.managerNamePlaceholder}
                  className={errors.managerName ? 'error' : ''}
                />
                <label className="checkbox-label same-as-rep">
                  <input
                    type="checkbox"
                    name="sameAsRepresentative"
                    checked={formData.sameAsRepresentative}
                    onChange={handleSameAsRepresentative}
                  />
                  <span className="checkmark"></span>
                  {t.sameAsRepresentative}
                </label>
              </div>
              {errors.managerName && <div className="error-message">{errors.managerName}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="managerPhone">{t.managerPhone} *</label>
                <input
                  type="tel"
                  id="managerPhone"
                  name="managerPhone"
                  value={formData.managerPhone}
                  onChange={handleInputChange}
                  placeholder={t.managerPhonePlaceholder}
                  className={errors.managerPhone ? 'error' : ''}
                  disabled={formData.sameAsRepresentative}
                />
                {errors.managerPhone && <div className="error-message">{errors.managerPhone}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="managerMobile">{t.managerMobile} *</label>
                <input
                  type="tel"
                  id="managerMobile"
                  name="managerMobile"
                  value={formData.managerMobile}
                  onChange={handleInputChange}
                  placeholder={t.managerMobilePlaceholder}
                  className={errors.managerMobile ? 'error' : ''}
                  disabled={formData.sameAsRepresentative}
                />
                {errors.managerMobile && <div className="error-message">{errors.managerMobile}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="managerEmail">{t.managerEmail} *</label>
              <input
                type="email"
                id="managerEmail"
                name="managerEmail"
                value={formData.managerEmail}
                onChange={handleInputChange}
                placeholder={t.managerEmailPlaceholder}
                className={errors.managerEmail ? 'error' : ''}
                disabled={formData.sameAsRepresentative}
              />
              {errors.managerEmail && <div className="error-message">{errors.managerEmail}</div>}
            </div>
          </div>
        )}

        {/* 버튼 */}
        {isInitialStepCompleted && (
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              {t.cancel}
            </button>
            <button type="submit" className="signup-btn" disabled={isSubmitting}>
              {isSubmitting ? '처리중...' : t.signup}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default SignupPage

