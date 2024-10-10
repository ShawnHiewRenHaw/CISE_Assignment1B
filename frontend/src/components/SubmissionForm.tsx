import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SubmissionForm() {
  const { register, handleSubmit, reset } = useForm();
  const [submitStatus, setSubmitStatus] = useState<string | null>(null); // For feedback

  // Function to handle form submission
  const onSubmit = async (data: any) => {
    const articleData = {
      ...data,
      status: 'pending', // Default status for new submissions
    };
  
    try {
      const response = await fetch('http://localhost:3001/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
  
      if (response.ok) {
        console.log('Article submitted successfully');
        reset(); // Reset the form after successful submission
      } else {
        console.error('Failed to submit article');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <h2>Submit a New Article</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title", { required: true })} placeholder="Title" />
        <p>
          <input {...register("authors", { required: true })} placeholder="Authors" />
        </p>
        <p>
          <input {...register("source", { required: true })} placeholder="Source" />
        </p>
        <p>
          <input {...register("pubyear", { required: true })} placeholder="Publication Year" />
        </p>
        <p>
          <input {...register("doi", { required: true })} placeholder="DOI" />
        </p>
        <p>
          <textarea {...register("summary", { required: true })} placeholder="Summary" />
        </p>
        <p>
          <select {...register("linked_discussion", { required: true })}>
            <option value="">Select SE practice...</option>
            <option value="TDD">TDD</option>
            <option value="Mob Programming">Mob Programming</option>
          </select>
        </p>
        <input type="submit" />

        {submitStatus && <p>{submitStatus}</p>}
      </form>
    </div>
  );
}
