import { addItem } from "@/lib/userData";
import { useRouter } from "next/router";
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export default function Add() {
  const router = useRouter();

  const [itemData, setItemData] = useState({
    name: "",
    due: new Date().toISOString().slice(0, 10),
    urgency: 3,
    impact: 3,
    recurring: false,
    recurrenceInterval: 1,
    recurrenceUnit: "week",
  });

  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setItemData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(
      itemData.name,
      itemData.due,
      itemData.urgency,
      itemData.impact,
      itemData.recurring ? itemData.recurrenceInterval : null,
      itemData.recurring ? itemData.recurrenceUnit : null,
    );
    router.push('/');
  }

  return (
    <div className="page-narrow">
      <h1 className="page-title">Add New Task</h1>
      <p className="page-subtitle">Describe what needs doing and how much it matters.</p>

      <Card className="prior-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Task name</Form.Label>
              <Form.Control type="text" placeholder="e.g. Finish quarterly report" required name="name" onChange={handleInput}/>
              <Form.Text>Be specific enough that future-you remembers what this means.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Due date</Form.Label>
              <Form.Control type="date" required name="due" value={itemData.due} onChange={handleInput}/>
            </Form.Group>

            <div className="form-section">
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center gap-2">
                  Impact <span className="slider-value">{itemData.impact}</span>
                </Form.Label>
                <Form.Control type="range" min="1" max="5" value={itemData.impact} required name="impact" onChange={handleInput}/>
                <Form.Text>The consequence of doing (or not doing) this.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="d-flex align-items-center gap-2">
                  Urgency <span className="slider-value">{itemData.urgency}</span>
                </Form.Label>
                <Form.Control type="range" min="1" max="5" value={itemData.urgency} required name="urgency" onChange={handleInput}/>
                <Form.Text>How pressing it feels.</Form.Text>
              </Form.Group>
            </div>

            <div className="form-section">
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="recurring"
                  name="recurring"
                  label="Repeat this task"
                  checked={itemData.recurring}
                  onChange={handleInput}
                />
                <Form.Text>How often should this be done?</Form.Text>
              </Form.Group>

              {itemData.recurring && (
                <Form.Group className="mb-2 recurrence-fields">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="text-muted">Every</span>
                    <Form.Control type="number" min="1" max="365" name="recurrenceInterval" value={itemData.recurrenceInterval} onChange={handleInput} aria-label="Recurrence interval" />
                    <Form.Select name="recurrenceUnit" value={itemData.recurrenceUnit} onChange={handleInput} aria-label="Recurrence unit">
                      <option value="day">day(s)</option>
                      <option value="week">week(s)</option>
                      <option value="month">month(s)</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              )}
            </div>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit">Add task</Button>
              <Button variant="outline-secondary" onClick={() => router.back()}>Cancel</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}