/** Legacy layout colours and logo. Newer theming lives on the Branding page. */
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { createSettings, getAllSettings, getImageBaseUrl } from "src/api";
import { Button, Card, Field, PageHeader, apiError, inputClass } from "src/components/ui";

const GROUPS = [
  { title: "Page areas", fields: [["headerBackground", "Header background"], ["menuBarBackground", "Menu bar background"], ["menuBarText", "Menu bar text"], ["footerBackground", "Footer background"], ["footerText", "Footer text"]] },
  { title: "Sidebar", fields: [["sidebarBackground", "Background"], ["sidebarText", "Text"], ["sideBarHoverBackgroundColor", "Hover background"], ["sideBarHoverTextColor", "Hover text"], ["sideBarActiveBackgroundColor", "Active background"], ["sideBarActiveTextColor", "Active text"]] },
  { title: "Buttons", fields: [["buttonBackground", "Background"], ["buttonText", "Text"]] },
];
const BLANK = Object.fromEntries([...GROUPS.flatMap((g) => g.fields.map(([k]) => [k, ""])), ["menuOption", ""]]);

function Colour({ id, label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm text-slate-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-slate-500">{value || "not set"}</span>
        <input id={id} type="color" value={value || "#ffffff"} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5" />
      </div>
    </div>
  );
}

export default function SettingsPage({ go }) {
  const [settings, setSettings] = useState(BLANK);
  const [savedLogo, setSavedLogo] = useState("");
  const [logo, setLogo] = useState(null);
  const [saving, setSaving] = useState(false);
  const { data, isLoading } = useQuery("adminSettings", () => getAllSettings({ pageNumber: 1, pageSize: 50 }));
  useEffect(() => {
    const list = data?.data?.settings;
    if (!list) return;
    setSettings((prev) => {
      const next = { ...prev };
      list.forEach(({ setting_name: k, setting_value: v }) => {
        if (String(v).startsWith("uploads/")) setSavedLogo(getImageBaseUrl(v));
        if (k in next) next[k] = v;
      });
      return next;
    });
  }, [data]);
  const preview = useMemo(() => (logo ? URL.createObjectURL(logo) : savedLogo), [logo, savedLogo]);

  const save = async () => {
    const form = new FormData();
    if (logo) form.append("image", logo);
    Object.entries(settings).forEach(([k, v]) => form.append(k, v));
    setSaving(true);
    try {
      await createSettings(form);
      toast.success("Settings saved");
    } catch (e) {
      toast.error(apiError(e, "Couldn't save settings"));
    } finally {
      setSaving(false);
    }
  };
  const set = (k) => (v) => setSettings((p) => ({ ...p, [k]: v }));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Settings" subtitle="Logo and layout colours." actions={<Button loading={saving} disabled={isLoading} onClick={save}>Save settings</Button>} />
      {go && (
        <p className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm text-slate-700">
          Member-area colours, fonts and publishing are on the{" "}
          <button type="button" onClick={() => go("Branding")} className="font-semibold text-link hover:underline">
            Branding page
          </button>
          .
        </p>
      )}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card className="space-y-4 p-5">
          <h2 className="text-base font-semibold text-slate-900">Logo and navigation</h2>
          <div className="flex h-28 items-center justify-center rounded-xl bg-slate-100">{preview ? <img src={preview} alt="Current logo" className="max-h-24 max-w-full object-contain" /> : <span className="text-sm text-slate-500">No logo uploaded</span>}</div>
          <Field label="Upload a logo" htmlFor="set-logo">
            <input
              id="set-logo"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-600"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && !f.type.startsWith("image/")) return toast.error("Please choose an image file");
                setLogo(f || null);
              }}
            />
          </Field>
          <Field label="Navigation style" htmlFor="set-menu">
            <select id="set-menu" className={inputClass} value={settings.menuOption} onChange={(e) => set("menuOption")(e.target.value)}>
              <option value="">Default</option>
              <option value="Sidebar">Sidebar</option>
              <option value="Menubar">Menu bar</option>
            </select>
          </Field>
        </Card>
        {GROUPS.map((g) => (
          <Card key={g.title} className="space-y-3 p-5">
            <h2 className="text-base font-semibold text-slate-900">{g.title}</h2>
            {g.fields.map(([k, label]) => (
              <Colour key={k} id={`set-${k}`} label={label} value={settings[k]} onChange={set(k)} />
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
