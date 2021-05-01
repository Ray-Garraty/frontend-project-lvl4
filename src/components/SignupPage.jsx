import React from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isEmpty, isNil } from 'lodash';
import routes from '../routes.js';
import { makeSignupUserFormInvalid } from '../slices/uiState.js';

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const doesUserAlreadyExist = useSelector((state) => state.uiState.signupForm.userAlreadyExists);
  return (
    <div className="d-flex flex-column h-100">
      <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
        <a className="mr-auto navbar-brand" href="/">{i18next.t('hexletChat')}</a>
      </nav>
      <Formik
        initialValues={{
          username: '',
          password: '',
          passwordConfirmation: '',
        }}
        validate={({ username, password, passwordConfirmation }) => {
          const errors = {};
          const usernameValidationSchema = yup.string().min(3).max(20);
          if (!usernameValidationSchema.isValidSync(username)) {
            errors.username = i18next.t('from3to20symbols');
          }
          const passwordValidationSchema = yup.string().min(6);
          if (!passwordValidationSchema.isValidSync(password)) {
            errors.password = i18next.t('6symbolsOrMore');
          }
          if (password !== passwordConfirmation) {
            errors.passwordConfirmation = i18next.t('passwordsMustMatch');
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const { username, password } = values;
          axios
            .post(routes.sighUpPath(), { username, password })
            .then((response) => {
              window.localStorage.setItem('user', JSON.stringify(response.data));
              setSubmitting(false);
              history.push('/');
            })
            .catch((error) => {
              if (error.response.status === 409) {
                // console.log('Такой пользователь уже существует');
                dispatch(makeSignupUserFormInvalid());
                setSubmitting(false);
              } else {
                console.log(error);
              }
            });
        }}
      >
        {({ isSubmitting, errors, touched }) => {
          const usernameInputClassNames = cn('form-control', { 'is-invalid': !isNil(errors.username && touched.username) || doesUserAlreadyExist });
          const passwordInputClassNames = cn('form-control', { 'is-invalid': !isNil(errors.password && touched.password) || doesUserAlreadyExist });
          const passwordConfirmationInputClassNames = cn('form-control', { 'is-invalid': !isNil(errors.passwordConfirmation && touched.passwordConfirmation) || doesUserAlreadyExist });
          return (
            <div className="container-fluid">
              <div className="row justify-content-center pt-5">
                <div className="col-sm-4">
                  <Form className="p-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="username">{i18next.t('userName')}</label>
                      <Field className={usernameInputClassNames} type="username" name="username" id="username" placeholder={i18next.t('from3to20symbols')} required />
                      <div className="invalid-feedback">
                        {errors.username}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="password">{i18next.t('password')}</label>
                      <Field className={passwordInputClassNames} type="password" name="password" id="password" placeholder={i18next.t('6symbolsOrMore')} required />
                      <div className="invalid-feedback">
                        {errors.password}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="passwordConfirmation">{i18next.t('confirmPassword')}</label>
                      <Field className={passwordConfirmationInputClassNames} type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder={i18next.t('passwordsMustMatch')} required />
                      <div className="invalid-feedback">
                        {errors.passwordConfirmation}
                        {doesUserAlreadyExist ? i18next.t('userAlreadyExists') : null}
                      </div>
                    </div>
                    <button className="w-100 mb-3 btn btn-outline-primary" type="submit" disabled={isSubmitting || !isEmpty(errors)}>
                      {i18next.t('signUp')}
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};
