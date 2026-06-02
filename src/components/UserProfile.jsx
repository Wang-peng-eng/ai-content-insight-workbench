export function UserProfile({ profile }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-soft">
      <p className="text-sm font-semibold text-cyan-800">用户画像</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950">核心人群判断</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ProfileField label="年龄段" value={profile.age} />
        <ProfileField label="职业" value={profile.occupation} />
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-800">特点</p>
        <ul className="mt-2 grid gap-2">
          {profile.traits.map((trait) => (
            <li key={trait} className="rounded-md bg-stone-100 px-3 py-2 text-sm text-slate-700">
              {trait}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-md border border-stone-200 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-950">{value}</p>
    </div>
  )
}
