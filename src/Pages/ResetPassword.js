import React from 'react'
import Header from '../Components/Header';
import FormLayout from '../Components/FormLayout'
import PasswordResetForm from '../Components/PasswordResetForm'
import ErrorBoundary from '../Context/ErrorBoundary'

const ResetPassword = () => {
    return (
        <div>
            <Header />
            <FormLayout>
                <ErrorBoundary>
                    <PasswordResetForm />
                </ErrorBoundary>
            </FormLayout>
        </div>
    )
}

export default ResetPassword
