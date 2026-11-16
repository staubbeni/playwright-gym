"use client";

import { useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { PlaygroundCard } from "./card";

type Errors = Partial<Record<"name" | "email" | "password" | "terms", string>>;

export default function FormsPlayground() {
  const bug = useLessonBugs("04-forms");
  const [values, setValues] = useState({ name: "", email: "", password: "", plan: "Free", role: "Student", terms: false });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("Complete the form to continue.");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Full name is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email) && !bug("2.1")) next.email = "Enter a valid email address.";
    if (values.password.length < 8 && !bug("2.2")) next.password = "Password must be at least 8 characters.";
    if (!values.terms && !bug("2.3")) next.terms = "You must accept the terms.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("Fix the errors above.");
      return;
    }
    if (bug(1)) return;
    const plan = bug("3.1") ? "Free" : values.plan;
    const role = bug("3.2") ? "Student" : values.role;
    setStatus(`Account created for ${values.name.trim()} on the ${plan} plan as a ${role}.`);
  };

  const reset = () => {
    // 3.3: reset forgets to clear the name
    setValues({ name: bug("3.3") ? values.name : "", email: "", password: "", plan: "Free", role: "Student", terms: false });
    setErrors({});
    setStatus("Complete the form to continue.");
  };

  const field = (key: "name" | "email" | "password", label: string, type = "text") => (
    <>
      <label htmlFor={`form-${key}`}>{label}</label>
      <input
        id={`form-${key}`}
        type={type}
        value={values[key]}
        aria-invalid={Boolean(errors[key])}
        onChange={(event) => setValues({ ...values, [key]: event.target.value })}
      />
      {errors[key] && <p className="error-text" role="alert">{errors[key]}</p>}
    </>
  );

  return (
    <PlaygroundCard lessonId="04-forms" title="Registration form">
      <form className="form-stack" noValidate onSubmit={submit}>
        {field("name", "Full name")}
        {field("email", "Email address", "email")}
        {field("password", "Password", "password")}
        <label htmlFor="form-plan">Plan</label>
        <select id="form-plan" value={values.plan} onChange={(event) => setValues({ ...values, plan: event.target.value })}>
          <option>Free</option>
          <option>Pro</option>
          <option>Team</option>
        </select>
        <fieldset>
          <legend>Role</legend>
          {["Student", "Teacher"].map((role) => (
            <label className="checkbox-row" key={role}>
              <input type="radio" name="role" value={role} checked={values.role === role} onChange={() => setValues({ ...values, role })} />
              {role}
            </label>
          ))}
        </fieldset>
        <label className="checkbox-row">
          <input type="checkbox" checked={values.terms} onChange={(event) => setValues({ ...values, terms: event.target.checked })} />
          I accept the terms
        </label>
        {errors.terms && <p className="error-text" role="alert">{errors.terms}</p>}
        <div className="button-row">
          <button className="primary-button" type="submit">Create account</button>
          <button className="secondary-button" type="button" onClick={reset}>Reset form</button>
        </div>
      </form>
      <p className="result-panel" role="status">{status}</p>
    </PlaygroundCard>
  );
}
