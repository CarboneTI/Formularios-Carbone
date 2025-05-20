"use client";

import { useState, useEffect, useRef } from "react";
import moment from "moment-timezone";
import "moment/locale/pt-br";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_blue.css";

export default function FormularioReagendamentoHtml() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dataHora, setDataHora] = useState("");
  const [selectedAgendamento, setSelectedAgendamento] = useState("");
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(false);
  const flatpickrRef = useRef<any>(null);

  // Formatar telefone brasileiro
  const formatBrazilPhone = (numStr: string | number) => {
    if (!numStr) return "";
    let phoneStr = typeof numStr !== "string" ? String(numStr) : numStr;
    if (phoneStr.startsWith("55")) phoneStr = phoneStr.substring(2);
    if (phoneStr.length === 11) {
      const area = phoneStr.substring(0, 2);
      const nine = phoneStr.substring(2, 3);
      const part1 = phoneStr.substring(3, 7);
      const part2 = phoneStr.substring(7);
      return `(${area}) ${nine} ${part1}-${part2}`;
    } else if (phoneStr.length === 10) {
      const area = phoneStr.substring(0, 2);
      const part1 = phoneStr.substring(2, 6);
      const part2 = phoneStr.substring(6);
      return `(${area}) ${part1}-${part2}`;
    }
    return phoneStr;
  };

  // Carrega os agendamentos do webhook
  const carregarAgendamentos = async () => {
    const urlWebhookDropdown =
      "https://autogrowth.cabonesolucoes.com.br/webhook/9a2481ea-ce4c-46b6-a60e-69150d472f28-reagendamento";
    try {
      setIsLoading(true);
      const response = await fetch(urlWebhookDropdown, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Erro ao carregar agendamentos existentes");
      const data = await response.json();
      setAgendamentos(data);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar os agendamentos existentes");
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar Flatpickr
  useEffect(() => {
    let flatpickr: any;
    import("flatpickr").then(({ default: Flatpickr }) => {
      import("flatpickr/dist/l10n/pt").then(({ Portuguese: pt }) => {
        flatpickr = Flatpickr("#dataHoraHtml", {
          enableTime: true,
          dateFormat: "Y-m-d H:i",
          time_24hr: true,
          locale: pt,
          minDate: new Date(),
          onChange: function (selectedDates: Date[]) {
            if (!selectedDates.length || selectedDates[0] < new Date()) {
              setDataHora("");
              setIsValid(false);
            } else {
              setDataHora(moment(selectedDates[0]).format("YYYY-MM-DD HH:mm"));
              setIsValid(true);
            }
          },
        });
        flatpickrRef.current = flatpickr;
      });
    });
    return () => {
      if (flatpickr) flatpickr.destroy();
    };
  }, []);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  // Validação do formulário
  useEffect(() => {
    setIsValid(Boolean(dataHora && selectedAgendamento));
  }, [dataHora, selectedAgendamento]);

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    // Validação da data/hora (deve ser futura)
    const inputMoment = moment.tz(dataHora, "YYYY-MM-DD HH:mm", "America/Sao_Paulo");
    if (!inputMoment.isValid() || inputMoment.isBefore(moment())) {
      setError("A data/hora selecionada já passou. Selecione um horário futuro.");
      setIsLoading(false);
      return;
    }
    if (!selectedAgendamento) {
      setError("Selecione um agendamento!");
      setIsLoading(false);
      return;
    }
    const horarioUTC = inputMoment.utc().format();
    const leadSelecionado = agendamentos[parseInt(selectedAgendamento)];
    const payload = { novoHorario: horarioUTC, ...leadSelecionado };
    try {
      const urlReagendar =
        "https://autogrowth.cabonesolucoes.com.br/webhook/f68859bf-8577-4b6f-b28e-2723ffcdbe6a-formulario-de-reagendamento";
      const response = await fetch(urlReagendar, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseText = await response.text();
      if (responseText.includes("não está disponível")) {
        setError(responseText);
      } else {
        setSuccess(responseText || "Reagendamento realizado com sucesso!");
        setDataHora("");
        setSelectedAgendamento("");
        setTimeout(carregarAgendamentos, 1000);
        if (flatpickrRef.current) flatpickrRef.current.clear();
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao enviar o reagendamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="formReagendamento" className="min-h-screen flex items-center justify-center bg-[#0F1117] py-8 px-2">
      <div className="container-form max-w-md w-full mx-auto">
        <div className="logo-container mb-2">
          <img
            src="https://carbonecompany.com.br/wp-content/uploads/2025/02/android-chrome-512x512-2.png"
            alt="Carbone Company Logo"
            className="mx-auto"
            style={{ width: 80 }}
          />
        </div>
        <h1 className="text-center text-[1.8rem] font-bold mb-2" style={{ color: '#FFC600' }}>Reagendamento</h1>
        <p className="text-center text-base mb-5 text-white/90">Selecione a data/hora (São Paulo) e escolha um agendamento existente.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-grid grid grid-cols-1 gap-5 mb-2">
            <div>
              <label htmlFor="dataHoraHtml" className="block mb-1 font-bold text-white">Data e Hora:</label>
              <input
                type="text"
                id="dataHoraHtml"
                placeholder="Selecione data e hora"
                className="w-full p-2.5 rounded border border-[#444] bg-[#222] text-white text-base focus:ring-2 focus:ring-[#FFC600] focus:border-[#FFC600] transition-colors"
                autoComplete="off"
                readOnly
                value={dataHora}
                onChange={() => {}}
              />
            </div>
            <div>
              <label htmlFor="dropdownAgendamentosHtml" className="block mb-1 font-bold text-white">Agendamentos:</label>
              <select
                id="dropdownAgendamentosHtml"
                className="w-full p-2.5 rounded border border-[#444] bg-[#222] text-white text-base"
                value={selectedAgendamento}
                onChange={e => setSelectedAgendamento(e.target.value)}
              >
                <option value="">Selecione...</option>
                {agendamentos.map((item, index) => (
                  <option key={index} value={index}>
                    {`${item.Nome || ""} | ${formatBrazilPhone(item.Numero || "")}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded bg-[#FFC600] text-black font-bold text-lg transition-colors hover:bg-[#e6b800] focus:bg-[#FFC600] focus:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>
        <div id="avisoEnvioHtml" className="text-center mt-4 min-h-[24px]">
          {error && <span style={{ color: "#FF6B6B", fontWeight: 700 }}>{error}</span>}
          {success && <span style={{ color: "#4BB543", fontWeight: 700 }}>{success}</span>}
        </div>
        {/* CSS customizado para Flatpickr e container */}
        <style jsx>{`
          #formReagendamento {
            --bg-color: #000;
            --text-color: #fff;
            --primary-color: #FFC600;
            --primary-hover: #e6b800;
            --input-bg: #222;
            --input-border: #444;
            --form-bg: rgba(17, 17, 17, 0.4);
            --form-border: rgba(255, 255, 255, 0.3);
            font-family: Arial, sans-serif;
          }
          .container-form {
            background: var(--form-bg);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 4px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--form-border);
            min-height: 450px;
            color: var(--text-color);
            opacity: 1;
            transition: opacity 0.5s ease;
            position: relative;
            width: 100%;
            display: block;
          }
          .logo-container img {
            width: 80px;
          }
          /* Flatpickr overrides amarelo */
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-months .flatpickr-month {
            background: #FFC600 !important;
          }
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-current-month {
            color: #000 !important;
          }
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-weekday {
            background: #FFC600 !important;
            color: #000 !important;
          }
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-day.today {
            background: #FFC600 !important;
            color: #000 !important;
          }
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-day:hover,
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-day:focus {
            background: #FFC600 !important;
            color: #000 !important;
          }
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-day.selected,
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-day.startRange,
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-day.endRange {
            background: #FFC600 !important;
            border-color: #FFC600 !important;
            color: #000 !important;
          }
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-time input {
            border: 1px solid #000 !important;
            background: #fff !important;
            color: #000 !important;
          }
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-time input:hover,
          #formReagendamento .flatpickr-calendar.material_blue .flatpickr-time input:focus {
            border-color: #FFC600 !important;
          }
        `}</style>
      </div>
    </div>
  );
} 